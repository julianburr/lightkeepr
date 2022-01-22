import { Storage } from "@google-cloud/storage";

import credentials from "google-service-account.json";

import { createHandler } from "src/utils/node/api";

const storage = new Storage({ projectId: credentials.project_id, credentials });
const bucket = storage.bucket("lightkeepr-7a7ee.appspot.com");

async function readJson(stream: any): Promise<string> {
  let buf = "";
  return new Promise((resolve, reject) => {
    stream
      .on("data", (d: string) => (buf += d))
      .on("end", () => resolve(buf))
      .on("error", (e: any) => reject(e));
  });
}

export default createHandler({
  get: async (req, res) => {
    const { reportId } = req.query;

    const file = bucket.file(`${reportId}.json`);

    const [meta, api] = await file.get();
    const data = await readJson(file.createReadStream());

    res.status(200).json({ meta, api, report: JSON.parse(data) });
  },
});
