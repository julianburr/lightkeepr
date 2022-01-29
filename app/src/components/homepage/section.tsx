import { ComponentProps } from "react";
import styled from "styled-components";

type Background = "auto" | "light" | "dark";

type SectionProps = ComponentProps<typeof Inner> & {
  background?: Background;
};

const Container = styled.section<{ background: Background }>`
  width: 100%;
  margin: 0;
  padding: 7.2rem 0;
  position: relative;
  overflow: hidden;

  background: ${(props) =>
    props.background === "dark" ? "var(--sol--palette-sand-50)" : "#fff"};

  &:nth-child(odd) {
    background: ${(props) =>
      ["dark", "auto"].includes(props.background)
        ? "var(--sol--palette-sand-50)"
        : "#fff"};
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 104rem;
  padding: 2.4rem;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  h1,
  h2 {
    margin: 0 0 3.2rem;
  }

  @media (min-width: 800px) {
    text-align: center;
  }
`;

export function Section({ background = "auto", ...props }: SectionProps) {
  return (
    <Container background={background}>
      <Inner {...props} />
    </Container>
  );
}

export const SectionContent = styled.div`
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
`;
