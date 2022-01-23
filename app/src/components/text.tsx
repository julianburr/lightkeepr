import { HTMLProps } from "react";
import styled from "styled-components";

type HeadingProps = HTMLProps<HTMLHeadingElement> & {
  level: 1 | 2 | 3 | 4;
};

export function Heading({ level = 1, ...props }: HeadingProps) {
  const El = `h${level}`;
  return <El {...props} />;
}

export const P = styled.p<{ grey?: boolean }>`
  opacity: ${(props) => (props.grey ? ".6" : 1)};
`;

export const Small = styled(P)`
  font-size: 1.2rem;
`;

export const Tiny = styled(P)`
  font-size: 1rem;
`;

export const Bold = styled.b``;

export const Semibold = styled.b``;

export const Underline = styled.u``;
