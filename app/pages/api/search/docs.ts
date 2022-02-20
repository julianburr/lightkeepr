import { createHandler } from "src/utils/node/api";
import { searchDocs } from "src/utils/node/search/docs";

export default createHandler({
  post: async (req, res) => {
    const results = await searchDocs(req.body.searchTerm || "");
    return res.status(200).json(results);
  },
});
