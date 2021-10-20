import "src/utils/firebase";

import { Suspense, useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";

import { FirebaseProvider } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";

import { AppLayout } from "src/layouts/app";
import { AuthLayout } from "src/layouts/auth";
import { SetupLayout } from "src/layouts/setup";
import { LoginScreen } from "src/screens/auth/login";
import { LoadingLayout } from "src/layouts/loading";

const Styles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  html, body, #__next {
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 1.4;
    color: #444;
  }

  b {
    font-weight: 800;
  }

  h1 {
    font-size: 2.8rem;
    margin: 2.4rem 0 1.2rem;
  }

  h2 {
    font-size: 2rem;
    margin: 1.6rem 0 .8rem;
  }

  h3 {
    font-size: 1.6rem;
    margin: 1.6rem 0 .4rem;
  }

  h4 {
    font-size: 1.4rem;
    margin: 1.6rem 0 0;
  }

  h1, h2, h3, h4 {
    font-weight: 600;
    line-height: 1.2;

    &:first-child {
      margin-top: 0;
    }
  }

  p {
    margin: .8rem 0;
  }

  input, button, textarea, select {
    font: inherit;
  }
`;

function AppContent({ Component, pageProps }) {
  const authUser = useAuthUser();

  if (!authUser?.uid) {
    return (
      <AuthLayout {...pageProps}>
        <LoginScreen />
      </AuthLayout>
    );
  }

  if (!authUser.user?.name || !authUser.organisationUsers?.length) {
    return <SetupLayout {...pageProps} />;
  }

  return (
    <AppLayout>
      <Suspense fallback={<p>Loading...</p>}>
        <Component authUser={authUser} {...pageProps} />
      </Suspense>
    </AppLayout>
  );
}

export default function App(props) {
  // HACK: Suspense not suported on SSR yet :/
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Reset />
      <Styles />
      <FirebaseProvider>
        <Suspense fallback={<LoadingLayout text="Authenticating..." />}>
          <AppContent {...props} />
        </Suspense>
      </FirebaseProvider>
    </>
  );
}
