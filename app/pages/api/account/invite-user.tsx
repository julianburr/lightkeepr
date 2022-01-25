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

      // Get team and team user data from firestore
      if (!req.body.teamUserId) {
        return res.status(400).json({ message: "No team user specified" });
      }

      const teamUserSnapshot = await db
        .doc(`teamUsers/${req.body.teamUserId}`)
        .get();

      const teamUser = teamUserSnapshot.data();
      if (!teamUser) {
        return res.status(404).json({ message: "Team user not found" });
      }

      if (teamUser.status !== "pending") {
        return res.status(400).json({
          message: "Team user has invalid status to send invitation email",
        });
      }

      const teamSnapshot = await db.doc(`teams/${teamUser.team.id}`).get();

      const team = teamSnapshot.data();
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      // Put together email html
      const title = "You've been invited to Lightkeepr";

      const { html } = render(
        <InviteUserEmail
          title={title}
          teamUser={teamUser as any}
          team={team as any}
          acceptUrl={`${req.headers.origin}/app/setup/pending-invites`}
        />,
        { validationLevel: "soft" }
      );

      // Send via sendgrid
      sgMail.setApiKey(env.sendgrid.apiKey);
      const response = await sgMail.send({
        to: teamUser.user.id,
        from: "Lightkeepr <lightkeepr@julianburr.de>",
        subject: title,
        html,
      });

      res.status(response[0].statusCode).json(response[0]);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  },
});