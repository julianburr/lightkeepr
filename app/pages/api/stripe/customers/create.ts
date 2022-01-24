import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: async (req, res) => {
    const { email, name, teamId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email not provided" });
    }

    if (!name) {
      return res.status(400).json({ message: "Name not provided" });
    }

    if (!teamId) {
      return res.status(400).json({ message: "Team not provided" });
    }

    const customer = await stripeClient.customers.create({
      email,
      name,
      metadata: { teamId },
    });
    return res.status(200).json(customer);
  },
});
