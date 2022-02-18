import "src/utils/node/firebase";

import { getFirestore } from "firebase-admin/firestore";

import { createHandler } from "src/utils/node/api";
import { stripeClient } from "src/utils/node/stripe";

const db = getFirestore();

export default createHandler({
  post: async (req, res) => {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "Team not provided" });
    }

    const teamSnap = await db.collection("teams").doc(teamId).get();
    if (!teamSnap.exists) {
      return res.status(400).json({ message: "Invalid team provided" });
    }
    const team: any = { id: teamSnap.id, ...teamSnap.data() };

    if (team.stripeCustomerId) {
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
      metadata: { teamId: team.id },
    });
    return res.status(200).json(customer);
  },
});
