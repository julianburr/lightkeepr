import { stripeClient } from "../../../../../src/node/stripe";

export default async function handler(req, res) {
  const invoices = await stripeClient.invoices.list({
    customer: req.query.customerId,
    limit: 20,
  });
  res.status(200).json(invoices);
}
