import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";
import { event } from "src/utils/node/ga";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: withTeamToken(async (req, res, { user }) => {
    if (!req.query.subscriptionId) {
      return res.status(400).json({ message: "Subscription not defined" });
    }

    await stripeClient.subscriptions.update(req.query.subscriptionId, {
      cancel_at_period_end: true,
    });
    const data = await stripeClient.subscriptions.retrieve(
      req.query.subscriptionId
    );

    event({ uid: user.id, action: "stripe_subscription_cancelled" });
    res.status(200).json(data);
  }),
});
