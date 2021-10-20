import * as fs from "fs";
import * as path from "path";
import { Storage } from "@google-cloud/storage";

import credentials from "google-service-account.json";

const storage = new Storage({
  projectId: credentials.project_id,
  credentials,
});

const bucket = storage.bucket("lightkeepr-7a7ee.appspot.com");

async function readJson(stream: any): Promise<string> {
  let buf = "";
  return new Promise((resolve, reject) => {
    stream
      .on("data", (d) => (buf += d))
      .on("end", () => resolve(buf))
      .on("error", (e) => reject(e));
  });
}

export default async function handler(req, res) {
  const { reportId } = req.query;

  const file = bucket.file(`${reportId}.json`);

  try {
    const [meta, api] = await file.get();
    const data = await readJson(file.createReadStream());
    res.status(200).json({ meta, api, report: JSON.parse(data) });
  } catch (e) {
    res.status(500).json({ message: e.message, stack: e.stack });
  }
}
