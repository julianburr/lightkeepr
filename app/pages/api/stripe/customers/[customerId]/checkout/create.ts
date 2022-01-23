import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: async (req, res) => {
    if (!req.body.redirectUrl) {
      return res.status(400).json({ message: "Base URL not defined" });
    }

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
      success_url: `${req.body.redirectUrl}?status=success&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.body.redirectUrl}?status=failed&sessionId={CHECKOUT_SESSION_ID}`,
    });

    res.status(200).json(session);
  },
});
