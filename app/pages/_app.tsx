import "src/utils/firebase";

import { Suspense, ComponentType } from "react";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import Head from "next/head";

import { FirebaseProvider } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";

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

type AppContentProps = {
  Component: ComponentType<any>;
  pageProps: any;
};

function AppContent({ Component, pageProps }: AppContentProps) {
  const authUser = useAuthUser();
  return <Component authUser={authUser} {...pageProps} />;
}

export default function App(props: any) {
  // HACK: Suspense not suported on SSR yet :/
  // https://nextjs.org/docs/advanced-features/react-18
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <>
      <Head>
        {/* Add Google Font incl DNS prefetch for perf improvements */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Reset />
      <Styles />

      <FirebaseProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <AppContent {...props} />
        </Suspense>
      </FirebaseProvider>
    </>
  );
}
