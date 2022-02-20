import { Storage } from "@google-cloud/storage";
import createCompress from "compress-brotli";
import cache from "memory-cache";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";

import credentials from "src/google-service-account.json";

const { decompress } = createCompress();

const storage = new Storage({
  projectId: credentials.project_id,
  credentials,
});

const bucket = storage.bucket(env.firebase.storageBucket!);

export default createHandler({
  get: withTeamToken(async (req, res) => {
    const { reportId } = req.query;

    const fromCache = cache.get(`reports/${reportId}`);
    if (fromCache) {
      return res.status(200).json(fromCache);
    }

    const file = bucket.file(`${reportId}.brotli`);

    const [meta, api] = await file.get();
    const [compressedContent] = await file.download();

    const content = await decompress(compressedContent);
    const data = { meta, api, report: JSON.parse(content) };

    cache.put(`reports/${reportId}`, data, 24 * 60 * 60 * 1000);
    res.status(200).json(data);
  }),
});
