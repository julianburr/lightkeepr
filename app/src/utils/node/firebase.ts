import { cert, initializeApp } from "firebase-admin/app";

import { env } from "src/env";

import credentials from "src/google-service-account.json";

initializeApp({
  // eslint-disable-next-line
  // @ts-ignore
  credential: cert(credentials),
  databaseURL: env.firebase.databaseUrl,
});
