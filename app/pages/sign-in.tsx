import "src/utils/firebase";

import { useState } from "react";
import { useForm } from "react-cool-form";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";

import { useAuthUser } from "src/hooks/use-auth-user";
import { AuthLayout } from "src/layouts/auth";

import GoogleSvg from "src/assets/auth/google.svg";
import GithubSvg from "src/assets/auth/github.svg";
import { Field } from "src/components/field";
import { PasswordInput } from "src/components/password-input";
import { EmailInput } from "src/components/text-input";
import { Spacer } from "src/components/spacer";
import styled from "styled-components";
import { Form } from "src/components/form";
import { Button } from "src/components/button";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

type SigninProps = {
  isSignUp?: boolean;
};

export default function SignIn({ isSignUp }: SigninProps) {
  const router = useRouter();
  const authUser = useAuthUser();

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
        } else {
          await signInWithEmailAndPassword(
            auth,
            values.email!,
            values.password
          );
        }
      } catch (e: any) {
        console.error(e);
      }
    },
  });

  if (authUser.uid) {
    router.replace("/app");
    return null;
  }

  return (
    <AuthLayout>
      <Button
        icon={<GoogleSvg role="presentation" />}
        size="large"
        fullWidth
        onClick={() => signInWithRedirect(auth, googleProvider)}
      >
        {isSignUp ? "Sign up with Google" : "Sign in with Google"}
      </Button>

      <Spacer h=".6rem" />

      <Button
        icon={<GithubSvg role="presentation" />}
        size="large"
        fullWidth
        onClick={() => signInWithRedirect(auth, githubProvider)}
      >
        {isSignUp ? "Sign up with Github" : "Sign in with Github"}
      </Button>

      <Spacer h=".6rem" />

      {useEmail ? (
        <>
          <Spacer h="3.2rem" />

          <Form ref={form} gap=".6rem" noValidate>
            <Field
              name="email"
              Input={EmailInput}
              inputProps={{ placeholder: "your@email.com" }}
              error={use("errors")?.email}
              required
            />
            <Field
              name="password"
              Input={PasswordInput}
              inputProps={{ placeholder: "Enter your password" }}
              error={use("errors")?.password}
              required
            />
            {isSignUp && (
              <Field
                name="repeatPassword"
                Input={PasswordInput}
                inputProps={{ placeholder: "Repeat your password" }}
                error={use("errors")?.password}
                required
              />
            )}
            <Button
              intend="primary"
              size="large"
              fullWidth
              type="submit"
              disabled={use("isSubmitting")}
            >
              {isSignUp ? "Sign up with Email" : "Sign in with Email"}
            </Button>
          </Form>
        </>
      ) : (
        <Button size="large" fullWidth onClick={() => setUseEmail(true)}>
          {isSignUp ? "Sign up with Email" : "Sign in with Email"}
        </Button>
      )}

      {isSignUp ? (
        <p>
          Already have an account? Click here to{" "}
          <Link href="/sign-in">
            <a>sign in</a>
          </Link>{" "}
          instead.
        </p>
      ) : (
        <p>
          Don't have an account yet? No problem, click here to{" "}
          <Link href={`/sign-up?email=${use("values")?.email}`}>
            <a>sign up</a>
          </Link>
          .
        </p>
      )}
    </AuthLayout>
  );
}
