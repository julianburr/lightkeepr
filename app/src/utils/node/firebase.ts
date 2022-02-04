import { cert, initializeApp, getApp } from "firebase-admin/app";
import credentials from "google-service-account.json";

if (!getApp()?.name) {
  initializeApp({
    credential: cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key,
    }),
  });
}
