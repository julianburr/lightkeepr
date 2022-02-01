import "src/utils/node/firebase";

import * as fs from "fs";
import { NextApiRequest } from "next";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import formidable from "formidable";
import { Storage } from "@google-cloud/storage";
import createCompress from "compress-brotli";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";

import credentials from "google-service-account.json";
import { AUDITS } from "src/utils/audits";

const storage = new Storage({
  projectId: credentials.project_id,
  credentials,
});

const bucket = storage.bucket(env.firebase.storageBucket!);

const brotli = createCompress();
const db = getFirestore();

const REGRESSION_THRESHOLD = 0.2;

function parseRequest(
  req: NextApiRequest
): Promise<{ fields: any; files: any; form: any }> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (e, fields, files) => {
      if (e) {
        return reject(e);
      }
      return resolve({ fields, files, form });
    });
  });
}

function getMeta(reportData: any) {
  return {
    gatherMode: reportData?.gatherMode || null,
    userAgent: reportData?.userAgent || null,
    environment: reportData?.environment || null,
    lighthouseVersion: reportData?.lighthouseVersion || null,
    configSettings: reportData?.configSettings || null,
  };
}

function getFlowMeta(reportData: any) {
  return getMeta(reportData?.steps?.[0]?.lhr);
}

function getSummary(reportData: any) {
  return {
    performance: reportData?.categories?.performance?.score || null,
    accessibility: reportData?.categories?.accessibility?.score || null,
    "best-practices": reportData?.categories?.["best-practices"]?.score || null,
    seo: reportData?.categories?.seo?.score || null,
    pwa: reportData?.categories?.pwa?.score || null,
  };
}

function getFlowSummary(reportData: any) {
  return reportData?.steps?.map?.((step: any) => getSummary(step?.lhr));
}

function getAudits(reportData: any) {
  return AUDITS.reduce((all: any, audit) => {
    all[audit.id] = reportData?.audits?.[audit.id];
    return all;
  }, {});
}

function getFlowAudits(reportData: any) {
  return reportData?.steps?.map?.((step: any) => getAudits(step?.lhr));
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createHandler({
  post: async (req, res) => {
    const [, token] = req.headers?.authorization?.match?.(/Bearer (.+)/) || [];
    const { fields, files } = await parseRequest(req);

    if (!req.query.runId) {
      return res.status(400).json({ message: "No run ID provided" });
    }

    if (!token) {
      return res.status(401).json({ message: "No bearer token provided" });
    }

    // Find project
    const projectsSnap = await db
      .collection("projects")
      .where("apiToken", "==", token)
      .limit(1)
      .get();

    if (projectsSnap.empty) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }

    const runSnap = await db.collection("runs").doc(fields.runId).get();
    if (!runSnap) {
      return res.status(400).json({ message: "Invalid run ID" });
    }

    const run: any = { id: runSnap.id, ...runSnap.data() };

    let project: any;
    projectsSnap.forEach((p) => {
      project = { id: p.id, ...p.data() };
    });
    const projectRef = db.collection("projects").doc(project.id);
    const teamRef = db.collection("teams").doc(project.team.id);

    if (!files?.file?.filepath) {
      return res.status(400).json({ message: "No report file provided" });
    }

    // Decompress report to extract summary etc.
    const compressedContent = fs.readFileSync(files.file.filepath);
    const reportDataContent = await brotli.decompress(compressedContent);
    const reportData = JSON.parse(reportDataContent);

    const meta =
      fields.type === "user-flow"
        ? getFlowMeta(reportData)
        : getMeta(reportData);
    const summary =
      fields.type === "user-flow"
        ? getFlowSummary(reportData)
        : getSummary(reportData);

    // Store some audits for easier access for summaries and reporting
    const audits =
      fields.type === "user-flow"
        ? getFlowAudits(reportData)
        : getAudits(reportData);

    // Find reports for comparison, most recent report on the same branch as well as
    // the most recent report on the main branch
    let previousBranchReport: any = null;
    if (run.brach) {
      const branchReportsSnap = await db
        .collection("reports")
        .where("project", "==", projectRef)
        .where("name", "==", fields.name)
        .where("branch", "==", run.branch)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();
      if (!branchReportsSnap.empty) {
        branchReportsSnap.forEach((r) => {
          previousBranchReport = { id: r.id, ...r.data() };
        });
      }
    }

    let previousMainReport: any = null;
    const mainReportsSnap = await db
      .collection("reports")
      .where("project", "==", projectRef)
      .where("name", "==", fields.name)
      .where("branch", "==", project.gitMain)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();
    if (!mainReportsSnap.empty) {
      mainReportsSnap.forEach((r) => {
        previousMainReport = { id: r.id, ...r.data() };
      });
    }

    // Determine status based on project setttings and lighthouse budgets
    let status = "passed";
    const statusReasons = [];

    // Any primary score regression
    let regressions: string[] = [];

    if (project.failOnRegression) {
      if (previousBranchReport) {
        regressions = Object.keys(summary).filter(
          (category) =>
            previousBranchReport.summary[category] &&
            (summary[category] || summary[category] === 0) &&
            previousBranchReport.summary[category] - summary[category] >
              REGRESSION_THRESHOLD
        );
        if (regressions?.length) {
          status = "failed";
          statusReasons.push("regression:branch");
        }
      }

      if (previousMainReport) {
        regressions = Object.keys(summary).filter(
          (category) =>
            previousMainReport.summary[category] &&
            (summary[category] || summary[category] === 0) &&
            previousMainReport.summary[category] - summary[category] >
              REGRESSION_THRESHOLD
        );
        if (regressions?.length) {
          status = "failed";
          statusReasons.push("regression:main");
        }
      }
    }

    // Any targets not met
    const failedTargets = Object.keys(summary).filter(
      (category) =>
        project.targets?.[category] &&
        summary[category] * 100 < project.targets?.[category]
    );
    if (failedTargets?.length) {
      status = "failed";
      statusReasons.push("target");
    }

    // Any budgets not met
    const budgets = [
      ...(reportData?.audits?.["performance-budget"]?.details?.items || []),
      ...(reportData?.audits?.["timing-budget"]?.details?.items || []),
    ];
    const failedBudgets = budgets.filter(
      (budget) =>
        !!budget.sizeOverBudget ||
        !!budget.countOverBudget ||
        !!budget.overBudget
    );
    if (failedBudgets?.length) {
      status = "failed";
      statusReasons.push("budget");
    }

    const reportName = fields.name || fields.url || null;

    const ref = await db.collection("reports").add({
      team: teamRef,
      project: projectRef,
      run: db.collection("runs").doc(run.id),
      branch: run.branch,
      url: fields.url || null,
      name: reportName,
      type: fields.type || null,
      createdAt: Timestamp.fromDate(new Date()),
      meta,
      summary,
      audits,
      budgets,
      previousBranchReport: previousBranchReport?.id
        ? db.collection("reports").doc(previousBranchReport.id)
        : null,
      previousMainReport: previousMainReport?.id
        ? db.collection("reports").doc(previousMainReport.id)
        : null,
      targets: project.targets,
      status,
      statusReasons,
      regressions,
      failedBudgets,
      failedTargets,
    });
    const report = await ref.get();

    // Update project to have list of unique report names cheaply available
    if (!project.pages?.includes(reportName)) {
      await projectRef.update({
        pages: [...(project.pages || []), reportName],
      });
    }

    // Upload report to gcloud
    const options = { destination: `${report.id}.brotli` };
    await bucket.upload(files.file.filepath, options);

    return res.status(200).json({ id: report.id, ...report.data() });
  },
});
