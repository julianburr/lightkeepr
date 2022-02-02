import { Button } from "src/components/mjml/button";
import { Spacer } from "src/components/mjml/spacer";
import { Heading, P } from "src/components/mjml/text";
import { EmailLayout } from "src/layouts/email";

type VerifyEmailProps = {
  title: string;
  verifyUrl: string;
};

export function VerifyEmail({ title, verifyUrl }: VerifyEmailProps) {
  return (
    <EmailLayout title={title}>
      <Heading>Thanks for signing up for Lightkeepr</Heading>
      <P>
        You've created an account in Lightkeepr. To ensure this is your email
        address, please click the button below to verify it.
      </P>

      <Spacer height={12} />

      <Button href={verifyUrl}>Verify email address</Button>
    </EmailLayout>
  );
}
