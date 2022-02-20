import "src/utils/firebase";

import {
  getAuth,
  signInWithCustomToken,
  signOut,
  updatePassword,
} from "firebase/auth";
import { collection, getFirestore, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-cool-form";

import { useCollection } from "src/@packages/firebase";
import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { PasswordInput } from "src/components/password-input";
import { Spacer } from "src/components/spacer";
import { Heading, P } from "src/components/text";
import { useToast } from "src/hooks/use-toast";
import { AuthLayout } from "src/layouts/auth";
import { event } from "src/utils/ga";

const db = getFirestore();
const auth = getAuth();

export default function ResetPassword() {
  const router = useRouter();
  const toast = useToast();

  const users = useCollection(
    query(collection(db, "users"), where("email", "==", router.query.email)),
    { key: `${router.query.email}/user`, fetch: !!router.query.email }
  );

  const { form, use } = useForm({
    validate: (values) => {
      if (values.password !== values.repeatPassword) {
        return { repeatPassword: "Passwords need to match" };
      }
    },
    onSubmit: async (values) => {
      await signInWithCustomToken(auth, router.query.rid!);
      try {
        await updatePassword(auth.currentUser!, values.password);
        event({
          action: "signin_reset_password",
          params: { email: router.query.email },
        });

        router.push("/app");
        toast.show({ message: "Your passwort has been reset successfully" });
      } catch (e) {
        console.error(e);
        signOut(auth);
        toast.show({
          message: "Something went wrong trying to reset the password",
        });
      }
    },
  });

  const isValid = users?.length && users[0]?.resetToken === router.query.rid;
  if (!isValid) {
    return (
      <AuthLayout>
        <Heading level={2}>Reset password</Heading>
        <P>
          The given token is not valid or outdated. Please make sure to follow
          the link in your latest reset email.
        </P>
        <P>
          Get back to the <Link href="/auth/sign-in">sign in</Link> page.
        </P>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Heading level={2}>Reset password</Heading>

      <Spacer h="1.6rem" />
      <form ref={form} noValidate>
        <FormGrid gap=".6rem">
          <Field
            name="password"
            Input={PasswordInput}
            inputProps={{ placeholder: "Enter your new password" }}
            showError={false}
            required
          />
          <Field
            name="repeatPassword"
            Input={PasswordInput}
            inputProps={{ placeholder: "Repeat your new password" }}
            showError={false}
            required
          />
          <Button
            type="submit"
            size="large"
            intent="primary"
            disabled={use("isSubmitting")}
          >
            Reset password
          </Button>
        </FormGrid>
      </form>

      <P>
        Get back to the <Link href="/auth/sign-in">sign in</Link> page.
      </P>
    </AuthLayout>
  );
}
