import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";
import { event } from "src/utils/node/ga";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: withTeamToken(async (req, res, { user, team }) => {
    if (!req.query.customerId) {
      return res.status(400).json({ message: "Customer not defined" });
    }

    if (!req.body.priceId) {
      return res.status(400).json({ message: "Plan not defined" });
    }

    const url = req.body.redirectUrl
      ? `${req.headers.origin}${req.body.redirectUrl}`
      : `${req.headers.origin}/app/${team.id}`;

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

    event({ uid: user.id, action: "stripe_checkout_session_created" });
    res.status(200).json(session);
  }),
});
