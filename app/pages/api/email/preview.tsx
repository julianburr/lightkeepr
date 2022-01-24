import { render } from "mjml-react";

import { createHandler } from "src/utils/node/api";
import { InviteUserEmail } from "emails/invite-user";

export default createHandler({
  get: async (_, res) => {
    const team = {
      id: "orgId",
      name: "Tesla",
    };

    const teamUser = {
      id: "orgUserId",
      createdBy: {
        id: "test@test.com",
      },
    };

    try {
      const { html } = render(
        <InviteUserEmail
          title="You've been invited to Lightkeepr"
          teamUser={teamUser}
          team={team}
          acceptUrl="https://google.com"
        />,
        { validationLevel: "soft" }
      );

      res.status(200).send(html);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  },
});
