import "src/utils/node/firebase";

import { getFirestore } from "firebase-admin/firestore";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";
import { withBearerToken } from "src/utils/node/api/with-bearer-token";
import { stripeClient } from "src/utils/node/stripe";

const db = getFirestore();

async function getAll(method: any) {
  const initialPage = await method?.list?.({ limit: 100 });
  let hasMore = initialPage.has_more;
  let data = initialPage.data;
  let lastId = data?.[data.length - 1]?.id;

  while (hasMore && lastId) {
    const nextPage = await method?.list?.({
      starting_after: lastId,
      limit: 100,
    });
    data = data.concat(nextPage.data);
    hasMore = nextPage?.has_more;
    lastId = data?.[data.length - 1]?.id;
  }

  return data;
}

type Cache = {
  teams: { [teamId: string]: any };
};

const cache: Cache = {
  teams: {},
};

export default createHandler({
  post: withBearerToken(async (_, res, { token }) => {
    if (token !== env.bearerToken) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }

    const promises: Promise<any>[] = [];

    const teamsSnap = await db.collection("teams").get();
    teamsSnap.forEach((team: any) => {
      cache.teams[team.id] = { id: team.id, ...team.data() };
    });

    const customers = await getAll(stripeClient.customers);
    const subscriptions = await getAll(stripeClient.subscriptions);

    for (const team of Object.values(cache.teams)) {
      const exists =
        !!team.stripeCustomerId &&
        !!customers.find((c: any) => c.id === team.stripeCustomerId);

      if (exists) {
        const subscription = subscriptions.filter(
          (subscription: any) => subscription.customer === team.stripeCustomerId
        )?.[0];

        if (team.plan === "premium" && !subscription) {
          cache.teams[team.id].plan = "free";
          cache.teams[team.id].stripeStatus = "no_subscriptions_found";
          promises.push(
            db.collection("teams").doc(team.id).update(cache.teams[team.id])
          );
        }

        if (subscription && subscription.status !== team.stripeStatus) {
          // Status doesn't match, so the subscription might have changed or payments
          // might have failed, so we want to double check the current plan
          if (team.plan === "premium") {
            // Payment(s) failed
            if (
              ["incomplete_expired", "unpaid"].includes(subscription.status)
            ) {
              cache.teams[team.id].plan = "free";
            }

            // Cancelled and current period ended
            const periodEnded =
              new Date(subscription.current_period_end * 1000) <= new Date();
            if (subscription.status === "cancelled" && periodEnded) {
              cache.teams[team.id].plan = "free";
            }
          }

          cache.teams[team.id].stripeStatus = subscription.status;
          promises.push(
            db.collection("teams").doc(team.id).update(cache.teams[team.id])
          );
        }
      } else {
        cache.teams[team.id].plan = "free";
        cache.teams[team.id].stripeCustomerId = null;
        cache.teams[team.id].stripeStatus = null;

        if (team.billingEmail && team.name) {
          const customer = await stripeClient.customers.create({
            email: team.billingEmail,
            name: team.name,
            metadata: { teamId: team.id },
          });
          cache.teams[team.id].stripeCustomerId = customer.id;
        }

        promises.push(
          db.collection("teams").doc(team.id).update(cache.teams[team.id])
        );
      }
    }

    await Promise.all(promises);

    return res.status(204).send("");
  }),
});
