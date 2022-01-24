import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: async (req, res) => {
    if (!req.query.subscriptionId) {
      return res.status(400).json({ message: "Subscription not defined" });
    }

    if (!req.body.itemId) {
      return res.status(400).json({ message: "Subscription item not defined" });
    }

    if (!req.body.priceId) {
      return res.status(400).json({ message: "Plan not defined" });
    }

    await stripeClient.subscriptions.update(req.query.subscriptionId, {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      items: [
        {
          id: req.body.itemId,
          price: req.body.priceId,
        },
      ],
    });
    const data = await stripeClient.subscriptions.retrieve(
      req.query.subscriptionId
    );

    res.status(200).json(data);
  },
});
