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

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const SignInButton = styled.button`
  border: 0.1rem solid #eee;
  background: transparent;
  width: 100%;
  height: 4.4rem;
  border-radius: 0.3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: border 0.2s, filter 0.2s, opacity 0.2s;

  svg {
    height: 1.4em;
    width: auto;
    margin: 0 0.8rem 0 0;
    filter: grayscale(1);
  }

  &:hover,
  &:focus {
    border-color: #ddd;

    svg {
      filter: grayscale(0);
    }
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

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
          console.log({ response });
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
      <SignInButton onClick={() => signInWithRedirect(auth, googleProvider)}>
        <GoogleSvg role="presentation" />
        <span>{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
      </SignInButton>

      <Spacer h=".6rem" />

      <SignInButton onClick={() => signInWithRedirect(auth, githubProvider)}>
        <GithubSvg role="presentation" />
        <span>{isSignUp ? "Sign up with Github" : "Sign in with Github"}</span>
      </SignInButton>

      <Spacer h=".6rem" />

      {useEmail ? (
        <>
          <Spacer h="1.6rem" />
          <hr />
          <Spacer h="1.6rem" />

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
            <SignInButton type="submit" disabled={use("isSubmitting")}>
              {isSignUp ? "Sign up with Email" : "Sign in with Email"}
            </SignInButton>
          </Form>
        </>
      ) : (
        <SignInButton onClick={() => setUseEmail(true)}>
          {isSignUp ? "Sign up with Email" : "Sign in with Email"}
        </SignInButton>
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
