import { Storage } from "@google-cloud/storage";
import createCompress from "compress-brotli";
import cache from "memory-cache";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";
import { withUserToken } from "src/utils/node/api/with-user-token";
import { event } from "src/utils/node/ga";

import credentials from "src/google-service-account.json";

const { decompress } = createCompress();

const storage = new Storage({
  projectId: credentials.project_id,
  credentials,
});

const bucket = storage.bucket(env.firebase.storageBucket!);

export default createHandler({
  get: withUserToken(async (req, res, { user }) => {
    const { reportId } = req.query;

    const fromCache = cache.get(`reports/${reportId}`);
    if (fromCache) {
      event({ uid: user.id, action: "report_read_from_cache" });
      return res.status(200).json(fromCache);
    }

    const file = bucket.file(`${reportId}.brotli`);

    const [meta, api] = await file.get();
    const [compressedContent] = await file.download();

    const content = await decompress(compressedContent);
    const data = { meta, api, report: JSON.parse(content) };

    cache.put(`reports/${reportId}`, data, 24 * 60 * 60 * 1000);

    event({ uid: user.id, action: "report_read" });
    res.status(200).json(data);
  }),
});
