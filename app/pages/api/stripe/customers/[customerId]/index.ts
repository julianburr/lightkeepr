import { NextApiRequest, NextApiResponse } from "next";

import { stripeClient } from "src/node/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const customer = await stripeClient.customers.retrieve(req.query.customerId);
  const subscriptions = await stripeClient.subscriptions.list({
    customer: req.query.customerId,
    limit: 20,
  });
  const paymentMethods = await stripeClient.paymentMethods.list({
    customer: req.query.customerId,
    type: "card",
  });
  res.status(200).json({
    ...customer,
    subscriptions: subscriptions.data,
    paymentMethods: paymentMethods.data,
  });
}
