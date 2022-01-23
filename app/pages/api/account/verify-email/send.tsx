import "src/utils/node/firebase";

import { createHash } from "crypto";
import { getAuth } from "firebase-admin/auth";
import sgMail from "@sendgrid/mail";
import { render } from "mjml-react";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";

import { VerifyEmail } from "emails/verify";

const auth = getAuth();

export default createHandler({
  post: async (req, res) => {
    // Bail if sendgrid is not configured properly
    if (!env.sendgrid.apiKey) {
      return res.status(500).json({ message: "Sendgrid not set up" });
    }

    // Validate request
    if (!req.body.userUid) {
      return res.status(400).json({ message: "User not specified" });
    }

    if (!req.body.email) {
      return res.status(400).json({ message: "Email not specified" });
    }

    // Fetch user from firebase and verify
    const user = await auth.getUser(req.body.userUid);
    if (user.email !== req.body.email) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Create confirmation hash for email link
    const content = `${process.env.SALT}:${user.metadata?.creationTime}:${user.email}:${user.uid}`;
    const hash = createHash("sha1").update(content).digest("hex");

    // Put together email html
    const title = "Please verify your email address";

    const { html } = render(
      <VerifyEmail
        title={title}
        verifyUrl={`${req.headers.origin}/app/setup/email-verification?vid=${hash}`}
      />,
      { validationLevel: "soft" }
    );

    // Send via sendgrid
    sgMail.setApiKey(env.sendgrid.apiKey);
    const response = await sgMail.send({
      to: req.body.email,
      from: "Lightkeepr <hello@julianburr.de>",
      subject: title,
      html,
    });

    res.status(response[0].statusCode).json(response[0]);
  },
});
