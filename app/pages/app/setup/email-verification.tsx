import "src/utils/firebase";

import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Spacer } from "src/components/spacer";
import { P } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { api } from "src/utils/api-client";

export default function EmailVerificationSetup() {
  const authUser = useAuthUser();

  return (
    <Auth>
      <SetupLayout>
        <h1>You need to verify your email address</h1>
        <Spacer height="1.8rem" />

        <P>
          We've sent you a verification email to your email address{" "}
          {authUser.email}. You need to confirm your email address before you
          can continue.
        </P>

        <Spacer h="1.2rem" />

        <ButtonBar
          left={
            <Button
              intent="primary"
              onClick={() =>
                api.post("/api/account/verify-email/send", {
                  email: authUser.email,
                  userUid: authUser.uid,
                  redirectUrl: `/app/setup/email-verification`,
                })
              }
            >
              Re-send confirmation email
            </Button>
          }
        />
      </SetupLayout>
    </Auth>
  );
}
