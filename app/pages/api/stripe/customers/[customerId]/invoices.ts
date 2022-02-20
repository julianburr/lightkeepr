import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  get: withTeamToken(async (req, res) => {
    if (!req.query.customerId) {
      return res.status(400).json({ message: "Invalid custom ID provided" });
    }

    const invoices = await stripeClient.invoices.list({
      customer: req.query.customerId,
      limit: 20,
    });
    res.status(200).json(invoices);
  }),
});
