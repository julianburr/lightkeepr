import { PropsWithChildren, useState, ReactNode } from "react";
import styled from "styled-components";

import { Heading } from "src/components/text";

import ChevronDownSvg from "src/assets/icons/chevron-down.svg";

const Container = styled.div`
  width: 100%;
`;

const Toggle = styled.button<{ expanded?: boolean }>`
  margin: 0;
  padding: 0;
  border: 0 none;
  background: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 0.3rem;

  svg {
    height: 1.05em;
    width: auto;
    transition: transform 0.2s;
    transform: ${(props) =>
      props.expanded ? "rotate(180deg)" : "rotate(0deg)"};
    margin: 0.2rem 0 0;
  }
`;

const Content = styled.div``;

type AccordionProps = PropsWithChildren<{
  title: ReactNode;
  initialExpanded?: boolean;
}>;

export function Accordion({
  title,
  children,
  initialExpanded,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <Container>
      <Toggle
        onClick={() => setExpanded((state) => !state)}
        expanded={expanded}
      >
        <ChevronDownSvg />
        <Heading level={3}>{title}</Heading>
      </Toggle>
      {expanded && <Content>{children}</Content>}
    </Container>
  );
}
