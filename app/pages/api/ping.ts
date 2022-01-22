import { createHandler } from "src/utils/node/api";

export default createHandler({
  get: (_, res) => {
    res.status(200).json({ pong: new Date().getTime() });
  },
});
