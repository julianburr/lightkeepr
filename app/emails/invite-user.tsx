import { Button } from "src/components/mjml/button";
import { Spacer } from "src/components/mjml/spacer";
import { Heading, P } from "src/components/mjml/text";
import { EmailLayout } from "src/layouts/email";

type InviteUserEmailProps = {
  title: string;
  invitedBy: {
    email: string;
  };
  team: {
    id: string;
    name: string;
  };
  acceptUrl: string;
};

export function InviteUserEmail({
  title,
  invitedBy,
  team,
  acceptUrl,
}: InviteUserEmailProps) {
  return (
    <EmailLayout title={title}>
      <Heading>You've been invited to Lightkeepr</Heading>
      <P>
        You've been invited by {invitedBy.email} to join their team "{team.name}
        " in Lightkeepr. Click the button below to accept the invite and set up
        your user account.
      </P>

      <Spacer height={12} />

      <Button href={acceptUrl}>Accept invite</Button>
    </EmailLayout>
  );
}
