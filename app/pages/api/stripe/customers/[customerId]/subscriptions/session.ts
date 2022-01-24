import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: async (req, res) => {
    if (!req.body.teamId) {
      return res.status(400).json({ message: "Team not defined" });
    }

    if (!req.query.customerId) {
      return res.status(400).json({ message: "Customer not defined" });
    }

    if (!req.body.priceId) {
      return res.status(400).json({ message: "Plan not defined" });
    }

    const url = `${req.headers.origin}/app/${req.body.teamId}/billing`;

    const session = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: req.query.customerId,
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: `${url}?status=success&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}?status=failed&sessionId={CHECKOUT_SESSION_ID}`,
    });

    res.status(200).json(session);
  },
});
