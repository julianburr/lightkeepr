import { createHandler } from "src/utils/node/api";
import { event } from "src/utils/node/ga";
import { searchDocs } from "src/utils/node/search/docs";

export default createHandler({
  post: async (req, res) => {
    const results = await searchDocs(req.body.searchTerm || "");
    event({ category: "Docs search", action: req.body.searchTerm || "" });
    return res.status(200).json(results);
  },
});
