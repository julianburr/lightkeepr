import { stripeClient } from "../../../../src/node/stripe";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name } = req.body;
    console.log({ req, body: req.body, email, name });

    if (!email || !name) {
      res.status(402).json({ message: "You need to define email and name!" });
      return;
    }

    const customer = await stripeClient.customers.create({
      email,
      description: name,
    });
    return res.status(200).json(customer);
  }

  res.status(404);
}
