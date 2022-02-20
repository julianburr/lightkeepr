import "src/utils/node/firebase";

import { getFirestore } from "firebase-admin/firestore";

import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";
import { stripeClient } from "src/utils/node/stripe";

const db = getFirestore();

export default createHandler({
  post: withTeamToken(async (_, res, { user, team }) => {
    if (team.status === "archived") {
      return res
        .status(400)
        .json({ message: "Team has already been archived" });
    }

    let deleteAt = new Date();

    // Get current subscription status
    if (team.stripeCustomerId) {
      const subscriptions = await stripeClient.subscriptions.list({
        customer: team.stripeCustomerId,
        limit: 20,
      });

      const subscription = subscriptions?.data?.[0];
      if (subscription?.id) {
        deleteAt = new Date(subscription.current_period_end * 1000);
        await stripeClient.subscriptions.update(subscription.id, {
          cancel_at_period_end: true,
        });
      }
    }

    // For now we actually never fully delete the team, we just archive it
    // However, after `deleteAt` the cleanup will actually remove all records
    // from the team!
    await db
      .collection("teams")
      .doc(team.id)
      .update({
        status: "archived",
        archivedAt: new Date(),
        archivedBy: db.collection("users").doc(user.id),
        deleteAt,
      });

    // Done
    return res.status(204).send("");
  }),
});
