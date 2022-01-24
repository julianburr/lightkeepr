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

    if (!req.query.subscriptionId) {
      return res.status(400).json({ message: "Subscription not defined" });
    }

    const url = `${req.headers.origin}/app/${req.body.teamId}/billing`;

    const session = await stripeClient.checkout.sessions.create({
      mode: "setup",
      payment_method_types: ["card"],
      customer: req.query.customerId,
      setup_intent_data: {
        metadata: {
          customer_id: req.query.customerId,
          subscription_id: req.query.subscriptionId,
        },
      },
      success_url: `${url}/?status=success&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/?status=failed&sessionId={CHECKOUT_SESSION_ID}`,
    });

    res.status(200).json(session);
  },
});
