import { EmailLayout } from "src/layouts/email";
import { Button } from "src/components/mjml/button";
import { Heading, P } from "src/components/mjml/text";
import { Spacer } from "src/components/mjml/spacer";

type InviteUserEmailProps = {
  title: string;
  organisationUser: {
    id: string;
    createdBy: {
      id: string;
    };
  };
  organisation: {
    id: string;
    name: string;
  };
};

export function InviteUserEmail({
  title,
  organisationUser,
  organisation,
}: InviteUserEmailProps) {
  const acceptUrl =
    `https://lightkeepr.vercel.app/app/${organisationUser.id}` +
    `/setup/invitation`;
  return (
    <EmailLayout title={title}>
      <Heading>You've been invited to Lightkeepr</Heading>
      <P>
        You've been invited by <b>{organisationUser.createdBy.id}</b> to join
        their organisation <b>{organisation.name}</b> in Lightkeepr. Click the
        button below to accept the invite and set up your user account.
      </P>

      <Spacer height={12} />

      <Button href={acceptUrl}>Accept invite</Button>
    </EmailLayout>
  );
}
