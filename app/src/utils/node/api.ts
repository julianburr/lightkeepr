import { NextApiRequest, NextApiResponse } from "next";

type Handler = (req: NextApiRequest, res: NextApiResponse) => any;

type Endpoints = {
  get?: Handler;
  post?: Handler;
  put?: Handler;
  delete?: Handler;
};

export function createHandler(endpoints: Endpoints) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLowerCase() as keyof Endpoints;
    try {
      if (method && endpoints?.[method]) {
        await endpoints[method]?.(req, res);
      } else {
        res.status(404).json({ message: "Endpoint not found!" });
      }
    } catch (e: any) {
      res.status(500).json({ message: e.message, stack: e.strack });
    }
  };
}
