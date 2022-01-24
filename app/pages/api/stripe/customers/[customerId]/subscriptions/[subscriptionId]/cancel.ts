import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: async (req, res) => {
    if (!req.query.subscriptionId) {
      return res.status(400).json({ message: "Subscription not defined" });
    }

    await stripeClient.subscriptions.update(req.query.subscriptionId, {
      cancel_at_period_end: true,
    });
    const data = await stripeClient.subscriptions.retrieve(
      req.query.subscriptionId
    );

    res.status(200).json(data);
  },
});
