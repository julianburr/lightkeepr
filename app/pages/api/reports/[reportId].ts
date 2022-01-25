import { Storage } from "@google-cloud/storage";
import createCompress from "compress-brotli";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";

import credentials from "google-service-account.json";

const { decompress } = createCompress();

const storage = new Storage({
  projectId: credentials.project_id,
  credentials,
});

const bucket = storage.bucket(env.firebase.storageBucket!);

export default createHandler({
  post: async (req, res) => {
    const { reportId } = req.query;

    const file = bucket.file(`${reportId}.brotli`);

    const [meta, api] = await file.get();
    const [compressedContent] = await file.download();

    const content = await decompress(compressedContent);

    res.status(200).json({ meta, api, report: JSON.parse(content) });
  },
});
