import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";
import { event } from "src/utils/node/ga";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: withTeamToken(async (req, res, { user, team }) => {
    if (!req.query.customerId) {
      return res.status(400).json({ message: "Customer not defined" });
    }

    if (!req.query.subscriptionId) {
      return res.status(400).json({ message: "Subscription not defined" });
    }

    const url = `${req.headers.origin}/app/${team.id}/billing`;

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

    event({
      uid: user.id,
      action: "stripe_subscription_checkout_session_created",
    });
    res.status(200).json(session);
  }),
});
