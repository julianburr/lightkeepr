import "src/utils/node/firebase";

import sgMail from "@sendgrid/mail";
import { getFirestore } from "firebase-admin/firestore";
import { render } from "mjml-react";

import { InviteUserEmail } from "src/emails/invite-user";
import { env } from "src/env";
import { createHandler } from "src/utils/node/api";
import { withTeamToken } from "src/utils/node/api/with-team-token";

const db = getFirestore();

export default createHandler({
  post: withTeamToken(async (req, res, { team }) => {
    try {
      // Bail if sendgrid is not configured properly
      if (!env.sendgrid.apiKey) {
        return res.status(500).json({ message: "Sendgrid not set up" });
      }

      // Get team and team user data from firestore
      if (!req.body.email) {
        return res.status(400).json({ message: "No email specified" });
      }

      if (!team.invites?.includes(req.body.email)) {
        return res.status(400).json({
          message: "Email not found in team invites",
        });
      }

      const inviteStatus = team.inviteStatus?.[req.body.email];
      if (!inviteStatus) {
        return res.status(400).json({
          message: "Email does not have an invite status defined",
        });
      }

      if (inviteStatus.status !== "pending") {
        return res.status(400).json({
          message: "Invalid invite status",
        });
      }

      const invitedBy: any = await db
        .doc(`users/${inviteStatus.createdBy.id}`)
        .get()
        .then((res) => res.data());

      // Put together email html
      const title = "You've been invited to Lightkeepr";

      const { html } = render(
        <InviteUserEmail
          title={title}
          invitedBy={invitedBy}
          team={team as any}
          acceptUrl={`${req.headers.origin}/app/setup/pending-invites`}
        />,
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
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }),
});
