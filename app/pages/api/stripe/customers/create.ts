import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
      res.status(400).json({ message: "You need to define email and name!" });
      return;
    }

    const customer = await stripeClient.customers.create({
      email,
      description: name,
    });
    return res.status(200).json(customer);
  },
});
