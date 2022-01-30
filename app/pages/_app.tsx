import { Reset } from "styled-reset";
import Head from "next/head";

import { GlobalStyles } from "src/theme";

import favicon from "src/assets/favicon.png";
import { useRouter } from "next/router";
import { Suspense } from "src/components/suspense";
import { Loader } from "src/components/loader";
import { SuspenseProvider } from "src/@packages/suspense";
import { FirebaseProvider } from "src/@packages/firebase";
import { DialogProvider } from "src/hooks/use-dialog";
import { ToastProvider } from "src/hooks/use-toast";

export default function App({ Component, pageProps }: any) {
  const router = useRouter();

  // HACK: the main app and auth flows need the provider wrapped here
  // because a lot of pages use suspense directly, should probably refactor
  // to make `useSuspense`/`useDocument`/`useCollection`/etc SSR-safe
  const shouldRenderProviders =
    router.asPath === "/app" ||
    router.asPath?.startsWith("/app/") ||
    router.asPath?.startsWith("/setup") ||
    router.asPath?.startsWith("/auth");

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
            `&family=Lato` +
            `&display=swap`
          }
          rel="stylesheet"
        />
      </Head>

      <Reset />
      <GlobalStyles />

      {shouldRenderProviders ? (
        <Suspense fallback={<Loader />}>
          <SuspenseProvider>
            <FirebaseProvider>
              <DialogProvider>
                <ToastProvider>
                  <Component {...pageProps} />
                </ToastProvider>
              </DialogProvider>
            </FirebaseProvider>
          </SuspenseProvider>
        </Suspense>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
