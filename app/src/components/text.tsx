import { HTMLProps, ReactNode } from "react";
import styled from "styled-components";

type HeadingProps = HTMLProps<HTMLHeadingElement> & {
  level: 1 | 2 | 3 | 4;
  icon?: ReactNode;
};

export function Heading({ level = 1, icon, children, ...props }: HeadingProps) {
  const El = `h${level}`;
  return (
    <El {...props}>
      {icon}
      <span>{children}</span>
    </El>
  );
}

export const GroupHeading = styled(({ level = 3, ...props }) => (
  <Heading level={level} {...props} />
))`
  margin: 0;
  padding: 0;
  font-weight: 400;
  font-size: 1rem;
  opacity: 0.6;
  text-transform: uppercase;
`;

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
