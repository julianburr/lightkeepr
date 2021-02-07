import { ComponentType, FunctionComponent, ReactNode, useState } from "react";
import styled from "styled-components";

const Button = styled.button`
  border: 0 none;
  background: none;
  padding: 0;
  margin: 0;
  text-align: inherit;
  cursor: pointer;
`;

type AccordionProps = {
  Summary: ComponentType<{ expanded: boolean; setExpanded: any }>;
  children:
    | ReactNode
    | FunctionComponent<{ expanded: boolean; setExpanded: any }>;
  initialState?: boolean;
};

export function Accordion({
  Summary,
  children,
  initialState = false,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(initialState);
  return (
    <>
      <Button onClick={() => setExpanded((state) => !state)}>
        <Summary expanded={expanded} setExpanded={setExpanded} />
      </Button>
      {expanded
        ? typeof children === "function"
          ? children({ expanded, setExpanded })
          : children
        : null}
    </>
  );
}
