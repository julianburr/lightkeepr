import "src/utils/firebase";

import { Suspense, ComponentType } from "react";
import { Reset } from "styled-reset";
import Head from "next/head";

import { GlobalStyles } from "src/theme";
import { FirebaseProvider } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";

import favicon from "src/assets/favicon.png";
import { DialogProvider } from "src/hooks/use-dialog";
import { ToastProvider } from "src/hooks/use-toast";
import { Loader } from "src/components/loader";
import { SuspenseProvider } from "src/@packages/suspense";

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
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="robots" content="all" />

        {/* Basics */}
        <title>Lighkeepr</title>
        <meta
          name="description"
          content="Lighthouse performance scores in the cloud"
        />
        <meta name="keywords" content="performance, lighthouse, web vitals" />
        <link rel="icon" href={favicon.src} type="image/png" />

        {/* Add Google Font incl DNS prefetch for perf improvements */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          href={
            `https://fonts.googleapis.com/css2` +
            `?family=Playfair+Display:wght@400;700` +
            `&family=Source+Code+Pro:wght@400;700` +
            `&display=swap`
          }
          rel="stylesheet"
        />
      </Head>

      <Reset />
      <GlobalStyles />

      <SuspenseProvider>
        <FirebaseProvider>
          <Suspense fallback={<Loader message="Loading..." />}>
            <DialogProvider>
              <ToastProvider>
                <AppContent {...props} />
              </ToastProvider>
            </DialogProvider>
          </Suspense>
        </FirebaseProvider>
      </SuspenseProvider>
    </>
  );
}
