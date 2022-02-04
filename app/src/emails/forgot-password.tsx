import { Button } from "src/components/mjml/button";
import { Spacer } from "src/components/mjml/spacer";
import { Heading, P } from "src/components/mjml/text";
import { EmailLayout } from "src/layouts/email";

type ForgotPasswordEmailProps = {
  title: string;
  resetUrl: string;
};

export function ForgotPasswordEmail({
  title,
  resetUrl,
}: ForgotPasswordEmailProps) {
  return (
    <EmailLayout title={title}>
      <Heading>Forgot password?</Heading>
      <P>No problem. Click the button below to reset your password.</P>

      <Spacer height={12} />

      <Button href={resetUrl}>Reset password</Button>
    </EmailLayout>
  );
}
