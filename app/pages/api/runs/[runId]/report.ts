import "src/utils/node/firebase";

import * as fs from "fs";

import { Storage } from "@google-cloud/storage";
import createCompress from "compress-brotli";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import formidable from "formidable";
import { NextApiRequest } from "next";
import url from "next-absolute-url";
import fetch from "node-fetch";

import { env } from "src/env";
import { CATEGORIES, AUDITS } from "src/utils/audits";
import { createHandler } from "src/utils/node/api";
import { withProjectToken } from "src/utils/node/api/with-project-token";

import credentials from "src/google-service-account.json";

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
  if (reportData?.gatherMode === "snapshot") {
    return CATEGORIES.reduce((all: any, { id }) => {
      const initial = { passed: 0, total: 0 };
      all[id] =
        reportData?.categories?.[id]?.auditRefs?.reduce(
          (all: any, ref: any) => {
            // Only count the audit if the score is not `null`
            if (
              reportData.audits?.[ref.id]?.score ||
              reportData.audits?.[ref.id]?.score === 0
            ) {
              all.total++;
            }

            // Count the audit as passed when its score is over `.9`
            if (reportData.audits?.[ref.id]?.score > 0.9) {
              all.passed++;
            }

            return all;
          },
          initial
        ) || initial;
      return all;
    }, {});
  }

  return CATEGORIES.reduce((all: any, { id }) => {
    all[id] = reportData?.categories?.[id]?.score ?? null;
    return all;
  }, {});
}

function getFlowSummary(reportData: any) {
  return reportData?.steps?.map?.((step: any) => ({
    name: step.name,
    meta: getMeta(step.lhr),
    scores: getSummary(step.lhr),
  }));
}

function getAudits(reportData: any) {
  return AUDITS.reduce((all: any, audit) => {
    const value = reportData?.audits?.[audit.id];
    if (value !== undefined) {
      // Filtering `undefined` values out, because firestore doesn't like them
      all[audit.id] = value;
    }
    return all;
  }, {});
}

function getFlowAudits(reportData: any) {
  return reportData?.steps?.map?.((step: any) => getAudits(step?.lhr));
}

function getStatus({
  reportData,
  project,
  previousBranchReport,
  previousMainReport,
  summary,
}: any) {
  // Determine status based on project setttings and lighthouse budgets
  let value = "passed";
  const reason = [];

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
        value = "failed";
        reason.push("regression:branch");
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
        value = "failed";
        reason.push("regression:main");
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
    value = "failed";
    reason.push("target");
  }

  // Any budgets not met
  const budgets = [
    ...(reportData?.audits?.["performance-budget"]?.details?.items || []),
    ...(reportData?.audits?.["timing-budget"]?.details?.items || []),
  ];
  const failedBudgets = budgets.filter(
    (budget) =>
      !!budget.sizeOverBudget || !!budget.countOverBudget || !!budget.overBudget
  );
  if (failedBudgets?.length) {
    value = "failed";
    reason.push("budget");
  }

  return { value, reason, failedTargets, budgets, failedBudgets };
}

function getFlowStatus({
  reportData,
  project,
  previousBranchReport,
  previousMainReport,
  summary,
}: any) {
  const steps = summary?.map((step: any, index: number) =>
    getStatus({
      reportData: reportData?.steps?.[index],
      project,
      previousBranchReport,
      previousMainReport,
      summary: step,
    })
  );
  return {
    value: steps?.find((step: any) => step.value === "failed")
      ? "failed"
      : "passed",
    steps,
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createHandler({
  post: withProjectToken(async (req, res, { project }) => {
    const { fields, files } = await parseRequest(req);

    if (!req.query.runId) {
      return res.status(400).json({ message: "No run ID provided" });
    }

    const runSnap = await db.collection("runs").doc(fields.runId).get();
    if (!runSnap) {
      return res.status(400).json({ message: "Invalid run ID" });
    }

    const run: any = { id: runSnap.id, ...runSnap.data() };

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

    const statusArgs = {
      reportData,
      project,
      previousBranchReport,
      previousMainReport,
      summary,
    };
    const status =
      fields.type === "user-flow"
        ? getFlowStatus(statusArgs)
        : getStatus(statusArgs);

    const now = Timestamp.fromDate(new Date());
    const reportName = fields.name || fields.url || null;

    const ref = await db.collection("reports").add({
      team: teamRef,
      project: projectRef,
      run: db.collection("runs").doc(run.id),
      branch: run.branch,
      url: fields.url || null,
      name: reportName,
      type: fields.type || null,
      createdAt: now,
      meta,
      summary,
      audits,
      previousBranchReport: previousBranchReport?.id
        ? db.collection("reports").doc(previousBranchReport.id)
        : null,
      previousMainReport: previousMainReport?.id
        ? db.collection("reports").doc(previousMainReport.id)
        : null,
      targets: project.targets || null,
      status,
    });

    const report: any = await ref
      .get()
      .then((snap) => ({ id: snap.id, ...snap.data() }));

    // Update project to have list of unique report names cheaply available
    if (!project.pages?.includes(reportName)) {
      await projectRef.update({
        pages: [...(project.pages || []), reportName],
      });
    }

    // Upload report to gcloud
    const options = { destination: `${report.id}.brotli` };
    await bucket.upload(files.file.filepath, options);

    if (status.value === "failed") {
      // TODO: check if it's possible to use queue workers with vercel somehow
      // Notify all users that subscribed to this project if the report failed
      const { origin } = url(req);
      await fetch(`${origin}/api/notifications/create`, {
        method: "POST",
        body: JSON.stringify({
          type: "report-failed",
          ref: db.collection("reports").doc(report.id).path,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return res.status(200).json(report);
  }),
});
