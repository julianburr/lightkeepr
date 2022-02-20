import "src/utils/node/firebase";

import { createHash } from "crypto";

import sgMail from "@sendgrid/mail";
import { getAuth } from "firebase-admin/auth";
import { render } from "mjml-react";

import { VerifyEmail } from "src/emails/verify";
import { env } from "src/env";
import { createHandler } from "src/utils/node/api";
import { withUserToken } from "src/utils/node/api/with-user-token";

const auth = getAuth();

export default createHandler({
  post: withUserToken(async (req, res, { user }) => {
    // Bail if sendgrid is not configured properly
    if (!env.sendgrid.apiKey) {
      return res.status(500).json({ message: "Sendgrid not set up" });
    }

    if (!req.body.email) {
      return res.status(400).json({ message: "Email not specified" });
    }

    // Create confirmation hash for email link
    const content = `${process.env.SALT}:${user.metadata?.creationTime}:${user.email}:${user.uid}`;
    const hash = createHash("sha1").update(content).digest("hex");

    // Put together email html
    const title = "Please verify your email address";
    const url = req.body.redirectUrl
      ? `${req.headers.origin}${req.body.redirectUrl}`
      : `${req.headers.origin}/app`;

    const { html } = render(
      <VerifyEmail title={title} verifyUrl={`${url}?vid=${hash}`} />,
      { validationLevel: "soft" }
    );

    // TODO: check if it's possible to use queue workers with vercel somehow
    // Send via sendgrid
    sgMail.setApiKey(env.sendgrid.apiKey);
    const response = await sgMail.send({
      to: req.body.email,
      from: "Lightkeepr <hello@lightkeepr.io>",
      subject: title,
      html,
    });

    res.status(response[0].statusCode).json(response[0]);
  }),
});
