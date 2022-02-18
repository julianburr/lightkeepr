export const env = {
  salt: process.env.SALT,
  releaseHash: process.env.RELEASE_HASH,
  bearerToken: process.env.BEARER_TOKEN,
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    databaseUrl: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    priceId: {
      premium: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTHLY,
      },
    },
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
};
