import { useRouter } from "next/router";

import { useAuthUser } from "src/hooks/use-auth-user";
import { api } from "src/utils/api-client";
import { SetupLayout } from "src/layouts/setup";
import { Auth } from "src/components/auth";
import { Spacer } from "src/components/spacer";
import { P } from "src/components/text";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";

export default function EmailVerificationSetup() {
  const router = useRouter();
  const authUser = useAuthUser();

  // Verify email address if `vid` query is in current url
  if (authUser.uid && router.query.vid) {
    const promise = api.post("/api/account/verify-email", {
      userUid: authUser.uid,
      email: authUser.email,
      vid: router.query.vid,
    });

    promise
      .then((res) => {
        authUser.setAuthUser(res.data);
        router.replace(router.pathname);
      })
      .catch((e) => {
        console.error(e);
        router.replace(router.pathname);
      });

    throw promise;
  }

  return (
    <Auth>
      <SetupLayout>
        <h1>You need to verify your email address</h1>
        <Spacer height="1.8rem" />

        <P>
          We've sent you a verification email to your email address{" "}
          <b>{authUser.email}</b>. You need to confirm your email address before
          you can continue.
        </P>

        <Spacer h="1.2rem" />

        <ButtonBar
          left={
            <Button
              intend="primary"
              onClick={() =>
                api.post("/api/account/verify-email/send", {
                  email: authUser.email,
                  userUid: authUser.uid,
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
