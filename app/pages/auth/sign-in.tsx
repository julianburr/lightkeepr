import "src/utils/firebase";

import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-cool-form";

import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { PasswordInput } from "src/components/password-input";
import { Spacer } from "src/components/spacer";
import { EmailInput } from "src/components/text-input";
import { useErrorDialog } from "src/dialogs/error";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AuthLayout } from "src/layouts/auth";
import { api } from "src/utils/api-client";

import GithubSvg from "src/assets/auth/github.svg";
import GoogleSvg from "src/assets/auth/google.svg";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

type SigninProps = {
  isSignUp?: boolean;
};

export default function SignIn({ isSignUp }: SigninProps) {
  const router = useRouter();
  const authUser = useAuthUser();

  const errorDialog = useErrorDialog();

  const [useEmail, setUseEmail] = useState(!!router.query.email);
  const { form, use } = useForm({
    defaultValues: { email: router.query.email, password: "" },
    onSubmit: async (values) => {
      try {
        if (isSignUp) {
          const response = await createUserWithEmailAndPassword(
            auth,
            values.email!,
            values.password!
          );
          await api.post("/api/account/verify-email/send", {
            userUid: response.user.uid,
            email: values.email,
          });
        } else {
          await signInWithEmailAndPassword(
            auth,
            values.email!,
            values.password
          );
        }
      } catch (e: any) {
        switch (e.code) {
          case "auth/user-not-found":
            errorDialog.open({
              message:
                `User with the provided credentials not found! Make sure that ` +
                `your email and password are entered correctly.`,
            });
            break;
          case "auth/email-already-in-use":
            errorDialog.open({
              message:
                `A user with this email address already exists in the system. ` +
                `If you've logged in using a third party provider before, please ` +
                `log in with the same provider again.`,
            });
            break;
          case "auth/weak-password":
            errorDialog.open({
              message:
                `The password you've chosen is too weak. Please choose a password ` +
                `with at least 6 characters.`,
            });
            break;
          default:
            errorDialog.open(e);
        }
      }
    },
  });

  if (authUser.uid) {
    router.replace({
      pathname: "/app",
      query: router.query.plan ? { plan: router.query.plan } : {},
    });
    return null;
  }

  const email = use("values").email;

  return (
    <AuthLayout>
      <Button
        icon={<GoogleSvg role="presentation" />}
        size="large"
        intent="outline"
        fullWidth
        onClick={() => signInWithRedirect(auth, googleProvider)}
      >
        {isSignUp ? "Sign up with Google" : "Sign in with Google"}
      </Button>

      <Spacer h=".6rem" />

      <Button
        icon={<GithubSvg role="presentation" />}
        size="large"
        intent="outline"
        fullWidth
        onClick={() => signInWithRedirect(auth, githubProvider)}
      >
        {isSignUp ? "Sign up with Github" : "Sign in with Github"}
      </Button>

      <Spacer h=".6rem" />

      {useEmail ? (
        <>
          <Spacer h="3.2rem" />

          <form ref={form} noValidate>
            <FormGrid gap=".6rem">
              <Field
                name="email"
                Input={EmailInput}
                inputProps={{ placeholder: "your@email.com" }}
                showError={false}
                required
              />
              <Field
                name="password"
                Input={PasswordInput}
                inputProps={{ placeholder: "Enter your password" }}
                showError={false}
                required
              />
              {isSignUp && (
                <Field
                  name="repeatPassword"
                  Input={PasswordInput}
                  inputProps={{ placeholder: "Repeat your password" }}
                  showError={false}
                  required
                />
              )}
              <Button
                intent="primary"
                size="large"
                fullWidth
                type="submit"
                disabled={use("isSubmitting")}
              >
                {isSignUp ? "Sign up with email" : "Sign in with email"}
              </Button>
            </FormGrid>
          </form>
        </>
      ) : (
        <Button
          size="large"
          intent="outline"
          fullWidth
          onClick={() => setUseEmail(true)}
        >
          {isSignUp ? "Sign up with email" : "Sign in with email"}
        </Button>
      )}

      {isSignUp ? (
        <p>
          Already have an account? Click here to{" "}
          <Link href="/auth/sign-in">
            <a>sign in</a>
          </Link>{" "}
          instead.
        </p>
      ) : (
        <p>
          Don't have an account yet? No problem, click here to{" "}
          <Link
            href={{
              pathname: `/auth/sign-up`,
              query: email ? { email } : {},
            }}
          >
            <a>sign up</a>
          </Link>
          .
        </p>
      )}
    </AuthLayout>
  );
}
