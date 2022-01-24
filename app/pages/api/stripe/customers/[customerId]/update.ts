import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: async (req, res) => {
    if (!req.query.customerId) {
      return res.status(400).json({ message: "Custumer ID not defined" });
    }

    const customer = await stripeClient.customers.update(req.query.customerId, {
      email: req.body.email,
      name: req.body.name,
    });
    return res.status(200).json(customer);
  },
});
