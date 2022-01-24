import { loadStripe } from "@stripe/stripe-js";
import invariant from "invariant";

import { env } from "src/env";

let client: any;

export const stripeClient = async () => {
  invariant(env.stripe.publicKey, "Stripe key not configured correctly");

  if (client) {
    return client;
  }

  client = await loadStripe(env.stripe.publicKey);
  return client;
};
