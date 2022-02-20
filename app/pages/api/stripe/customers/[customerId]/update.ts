import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";
import { event } from "src/utils/node/ga";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: withTeamToken(async (req, res, { user }) => {
    if (!req.query.customerId) {
      return res.status(400).json({ message: "Invalid custom ID provided" });
    }

    const customer = await stripeClient.customers.update(req.query.customerId, {
      email: req.body.email,
      name: req.body.name,
    });

    event({ uid: user.id, action: "stripe_customer_updated" });
    return res.status(200).json(customer);
  }),
});
