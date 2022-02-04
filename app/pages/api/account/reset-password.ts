import { NextApiRequest, NextApiResponse } from "next";

import { createHandler } from "src/utils/node/api";

export default createHandler({
  post: (req: NextApiRequest, res: NextApiResponse) => {
    //...
  },
});
