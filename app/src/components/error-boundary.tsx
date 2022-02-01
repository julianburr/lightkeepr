import { Component, ComponentType } from "react";

import styled from "styled-components";

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

type PassThroughProps = {
  error: any;
  errorInfo: any;
  reset: () => void;
};

type ErrorBoundaryProps = {
  Error?: ComponentType<PassThroughProps>;
};

type ErrorBoundaryState = {
  error?: any;
  errorInfo?: any;
};

function DefaultError({ error }: PassThroughProps) {
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

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = {
    error: undefined,
    errorInfo: undefined,
  };

  componentDidCatch(error: any, errorInfo: any) {
    console.log({ error, errorInfo });
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      const Error = this.props.Error || DefaultError;
      return (
        <Error
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          reset={() =>
            this.setState({ error: undefined, errorInfo: undefined })
          }
        />
      );
    }

    return this.props.children;
  }
}
