import stripe from "stripe";

import { env } from "src/env";

// eslint-disable-next-line
// @ts-ignore
export const stripeClient = stripe(env.stripe.secretKey, {
  apiVersion: "2020-08-27",
});
