import { useRouter } from "next/router";
import { P } from "src/components/text";

import { AppLayout } from "src/layouts/app";
import { DocsLayout } from "src/layouts/docs";
import { WebsiteLayout } from "src/layouts/website";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 45rem;
  margin: 4.2rem auto;
  text-align: center;

  h1 {
    font-size: 7rem;
    margin: 0 0 3.2rem;
  }
`;

type ErrorPageProps = {
  statusCode?: number;
};

function ErrorMessage({ statusCode }: ErrorPageProps) {
  const router = useRouter();

  if (statusCode) {
    return (
      <Container>
        <h1>{statusCode}</h1>
        <P grey>
          Something went wrong. Try refresh the page. If the error persists ...
          well ... we're sorry.
        </P>
      </Container>
    );
  }

  return (
    <Container>
      <h1>404</h1>
      {router.asPath.startsWith("/docs/") ? (
        <>
          <P grey>The page you're looking for could not be found.</P>
          <P grey>
            The Lightkeepr documentation is still active work in progress, so
            you might have found a temporary placeholder. Please check this page
            again later.
          </P>
        </>
      ) : (
        <P grey>
          The page you're looking for could not be found. Check the url for any
          typos, otherwise the page might have been moved.
        </P>
      )}
    </Container>
  );
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const router = useRouter();

  if (router.asPath.startsWith("/docs/")) {
    return (
      <DocsLayout>
        <ErrorMessage statusCode={statusCode} />
      </DocsLayout>
    );
  }

  if (router.asPath.startsWith("/app/")) {
    return (
      <AppLayout>
        <ErrorMessage statusCode={statusCode} />
      </AppLayout>
    );
  }

  return (
    <WebsiteLayout>
      <ErrorMessage statusCode={statusCode} />
    </WebsiteLayout>
  );
}
