import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  get: async (req, res) => {
    const invoices = await stripeClient.invoices.list({
      customer: req.query.customerId,
      limit: 20,
    });
    res.status(200).json(invoices);
  },
});
