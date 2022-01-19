import { NextApiRequest, NextApiResponse } from "next";

import { stripeClient } from "src/node/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baseUrl = `http://localhost:3000/${req.query.orgId}/settings/subscription`;
  const session = await stripeClient.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: req.query.customerId,
    line_items: [
      {
        price: req.query.priceId,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}?status=success&sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}?status=failed&sessionId={CHECKOUT_SESSION_ID}`,
  });
  res.status(200).json(session);
}
