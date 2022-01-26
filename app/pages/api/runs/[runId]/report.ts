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

    if (!req.query.runId) {
      return res.status(400).json({ message: "No run ID provided" });
    }

    if (!token) {
      return res.status(401).json({ message: "No bearer token provided" });
    }

    const projectsSnap = await db
      .collection("projects")
      .where("apiToken", "==", token)
      .limit(1)
      .get();

    if (projectsSnap.empty) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }

    let project: any;
    projectsSnap.forEach((p) => {
      project = { id: p.id, ...p.data() };
    });

    const { fields, files } = await parseRequest(req);
    if (!files?.file?.filepath) {
      return res.status(400).json({ message: "No report file provided" });
    }

    const compressedContent = fs.readFileSync(files.file.filepath);
    const reportDataContent = await brotli.decompress(compressedContent);
    const reportData = JSON.parse(reportDataContent);

    const ref = await db.collection("reports").add({
      project: db.collection("projects").doc(project.id),
      run: db.collection("runs").doc(fields.runId),
      name: fields.name || null,
      type: fields.type || null,
      createdAt: Timestamp.fromDate(new Date()),

      // Pulling out some data from the report to have easier access to it
      // without having to request the whole report file
      meta:
        fields.type === "user-flow"
          ? getFlowMeta(reportData)
          : getMeta(reportData),
      summary:
        fields.type === "user-flow"
          ? getFlowSummary(reportData)
          : getSummary(reportData),
    });
    const report = await ref.get();

    // Upload report to gcloud
    const options = { destination: `${report.id}.brotli` };
    await bucket.upload(files.file.filepath, options);

    return res.status(200).json({ id: report.id, ...report.data() });
  },
});
