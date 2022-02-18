import { createHandler } from "src/utils/node/api";
import { withBearerToken } from "src/utils/node/api/with-bearer-token";
import { searchDocs } from "src/utils/node/search/docs";

export default createHandler({
  post: withBearerToken(async (req, res) => {
    const results = await searchDocs(req.body.searchTerm || "");
    return res.status(200).json(results);
  }),
});
