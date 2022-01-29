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

const storage = new Storage({
  projectId: credentials.project_id,
  credentials,
});

const bucket = storage.bucket(env.firebase.storageBucket!);

const brotli = createCompress();

const db = getFirestore();

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

    // Determine status based on project setttings
    let status = "passed";
    let statusReason = null;

    if (project.failOnRegression && previousBranchReport) {
      const hasRegression = Object.keys(summary).filter(
        (category) =>
          summary[category] < previousBranchReport.summary[category] - 0.2
      );
      if (hasRegression?.length) {
        status = "failed:regression";
        statusReason = hasRegression;
      }
    }

    if (status === "passed") {
      const hasBudgetFail = Object.keys(summary).filter(
        (category) =>
          project.budget?.[category] &&
          summary[category] * 100 < project.budget?.[category]
      );
      if (hasBudgetFail?.length) {
        status = "failed:budget";
        statusReason = hasBudgetFail;
      }
    }

    const ref = await db.collection("reports").add({
      project: projectRef,
      run: db.collection("runs").doc(run.id),
      branch: run.branch,
      name: fields.name || null,
      type: fields.type || null,
      createdAt: Timestamp.fromDate(new Date()),
      meta,
      summary,
      previousBranchReport: previousBranchReport?.id
        ? db.collection("reports").doc(previousBranchReport.id)
        : null,
      previousMainReport: previousMainReport?.id
        ? db.collection("reports").doc(previousMainReport.id)
        : null,
      status,
      statusReason,
    });
    const report = await ref.get();

    // Upload report to gcloud
    const options = { destination: `${report.id}.brotli` };
    await bucket.upload(files.file.filepath, options);

    return res.status(200).json({ id: report.id, ...report.data() });
  },
});
