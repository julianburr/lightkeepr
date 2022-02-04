import "src/utils/node/firebase";

import sgMail from "@sendgrid/mail";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { render } from "mjml-react";
import { NextApiRequest, NextApiResponse } from "next";

import { ForgotPasswordEmail } from "src/emails/forgot-password";
import { ForgotPasswordThirdPartyEmail } from "src/emails/forgot-password-third-party";
import { env } from "src/env";
import { createHandler } from "src/utils/node/api";

const auth = getAuth();
const db = getFirestore();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default createHandler({
  post: async (req: NextApiRequest, res: NextApiResponse) => {
    // Bail if sendgrid is not configured properly
    if (!env.sendgrid.apiKey) {
      return res.status(500).json({ message: "Sendgrid not set up" });
    }

    // Get team and team user data from firestore
    if (!req.body.email) {
      return res.status(400).json({ message: "No email specified" });
    }

    // Add random delay, to ensure hackers can't use the response time to see if
    // a user for a given email address exists
    await sleep(Math.random() * 2);

    // Get user from email
    const user = await auth.getUserByEmail(req.body.email);
    if (!user?.email) {
      await sleep(Math.random() * 2);
      return res.status(204).send("");
    }

    if (user.providerData?.[0]?.providerId !== "password") {
      // User used 3rd party login, so no password to reset
      // We probably still want to send them an email explaining this
      const title = "Forgot your password?";
      const { html } = render(<ForgotPasswordThirdPartyEmail title={title} />, {
        validationLevel: "soft",
      });

      // TODO: check if it's possible to use queue workers with vercel somehow
      // Send via sendgrid
      sgMail.setApiKey(env.sendgrid.apiKey);
      await sgMail.send({
        to: req.body.email,
        from: "Lightkeepr <hello@lightkeepr.io>",
        subject: title,
        html,
      });

      return res.status(204).send("");
    }

    // Put together email html
    const title = "Forgot your password?";
    const url = `${req.headers.origin}/auth/reset-password`;

    const hash = await auth.createCustomToken(user.uid);
    await db.collection("users").doc(user.uid).update({ resetToken: hash });

    const { html } = render(
      <ForgotPasswordEmail
        title={title}
        resetUrl={`${url}?rid=${hash}&email=${req.body.email}`}
      />,
      { validationLevel: "soft" }
    );

    // TODO: check if it's possible to use queue workers with vercel somehow
    // Send via sendgrid
    sgMail.setApiKey(env.sendgrid.apiKey);
    await sgMail.send({
      to: req.body.email,
      from: "Lightkeepr <hello@lightkeepr.io>",
      subject: title,
      html,
    });

    res.status(204).send("");
  },
});
