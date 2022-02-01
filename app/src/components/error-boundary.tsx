import { ComponentProps } from "react";
import styled from "styled-components";
import * as Sentry from "@sentry/react";

import { Heading, P } from "src/components/text";

import JellyfishSvg from "src/assets/illustrations/jellyfish.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 56rem;
  margin: 6rem auto;
  padding: 12rem 2.4rem 3rem;
  position: relative;

  h1 {
    font-size: 6.4rem;
    margin: 0 0 1.2rem;
  }
`;

const Jellyfish = styled(JellyfishSvg)`
  position: absolute;
  top: 0;
  right: 0;
  height: 20rem;
  width: auto;
  z-index: -1;
`;

export const ErrorMessage = styled.div`
  width: 100%;
  padding: 1.6rem;
  background: var(--sol--palette-sand-100);
  border-radius: var(--sol--border-radius-s);

  p {
    margin: 0;
  }
`;

function DefaultError({ error }: any) {
  if (error.code === 404) {
    return (
      <Container>
        <Jellyfish />
        <Heading level={1}>404</Heading>
        <P>
          The resource you were trying to access does not seem to exist. Maybe
          you tried to access an outdated page or you're trying to access a
          resource from another team.
        </P>
      </Container>
    );
  }

  return (
    <Container>
      <Jellyfish />
      <Heading level={1}>{error.code || "Ooops!"}</Heading>
      <P>
        Something went wrong. Please try again. If the error persist, consider
        creating an error report with reproduction steps.
      </P>
    </Container>
  );
}

export function ErrorBoundary({
  fallback = DefaultError,
  ...props
}: ComponentProps<typeof Sentry.ErrorBoundary>) {
  return <Sentry.ErrorBoundary fallback={fallback} {...props} />;
}
