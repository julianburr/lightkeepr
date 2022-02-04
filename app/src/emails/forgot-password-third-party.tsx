import { Heading, P } from "src/components/mjml/text";
import { EmailLayout } from "src/layouts/email";

type ForgotPasswordThirdPartyEmailProps = {
  title: string;
};

export function ForgotPasswordThirdPartyEmail({
  title,
}: ForgotPasswordThirdPartyEmailProps) {
  return (
    <EmailLayout title={title}>
      <Heading>Forgot password?</Heading>
      <P>
        Your account is currently linked to a third party provider, so there is
        no password to reset. Just log in with the same third party provider you
        used to set up your account.
      </P>
    </EmailLayout>
  );
}
