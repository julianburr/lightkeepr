import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";
import { event } from "src/utils/node/ga";
import { stripeClient } from "src/utils/node/stripe";

export default createHandler({
  post: withTeamToken(async (_, res, { user, team }) => {
    if (team.stripeCustomerId) {
      // Check if the customer ID is valid
      let stripeCustomer;
      try {
        stripeCustomer = await stripeClient.customers.retrieve(
          team.stripeCustomerId
        );
      } catch (e) {
        console.error(e);
      }

      if (stripeCustomer) {
        return res
          .status(400)
          .json({ message: "Team already has a customer ID assigned" });
      }
    }

    if (!team.billingEmail || !team.name) {
      return res
        .status(400)
        .json({ message: "Team has insufficient information" });
    }

    const customer = await stripeClient.customers.create({
      email: team.billingEmail,
      name: team.name,
      metadata: {
        product: "lightkeepr",
        teamId: team.id,
      },
    });

    event({ uid: user.id, action: "stripe_customer_created" });
    return res.status(200).json(customer);
  }),
});
