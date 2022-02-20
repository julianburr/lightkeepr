import "src/utils/node/firebase";

import { getFirestore } from "firebase-admin/firestore";

import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";
import { stripeClient } from "src/utils/node/stripe";

const db = getFirestore();

export default createHandler({
  post: withTeamToken(async (req, res, { team }) => {
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
    return res.status(200).json(customer);
  }),
});
