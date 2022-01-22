import "src/utils/node/firebase";

import { NextApiRequest, NextApiResponse } from "next";
import { render } from "mjml-react";
import { getFirestore } from "firebase-admin/firestore";
import sgMail from "@sendgrid/mail";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";
import { InviteUserEmail } from "emails/invite-user";

const db = getFirestore();

export default createHandler({
  post: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Bail if sendgrid is not configured properly
      if (!env.sendgrid.apiKey) {
        return res.status(500).json({ message: "Sendgrid not set up" });
      }

      // Get organisation and organisation user data from firestore
      if (!req.body.organisationUserId) {
        return res
          .status(400)
          .json({ message: "No organisation user specified" });
      }

      const organisationUserSnapshot = await db
        .doc(`organisationUsers/${req.body.organisationUserId}`)
        .get();

      const organisationUser = organisationUserSnapshot.data();
      if (!organisationUser) {
        return res.status(404).json({ message: "Organisation user not found" });
      }

      if (organisationUser.status !== "pending") {
        return res.status(400).json({
          message:
            "Organisation user has invalid status to send invitation email",
        });
      }

      const organisationSnapshot = await db
        .doc(`organisations/${organisationUser.organisation.id}`)
        .get();

      const organisation = organisationSnapshot.data();
      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      // Put together email html
      const title = "You've been invited to Lightkeepr";

      const { html } = render(
        <InviteUserEmail
          title={title}
          organisationUser={organisationUser as any}
          organisation={organisation as any}
        />,
        { validationLevel: "soft" }
      );

      // Send via sendgrid
      sgMail.setApiKey(env.sendgrid.apiKey);
      const response = await sgMail.send({
        to: organisationUser.user.id,
        from: "Lightkeepr <hello@julianburr.de>",
        subject: title,
        html,
      });

      res.status(response[0].statusCode).json(response[0]);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  },
});
