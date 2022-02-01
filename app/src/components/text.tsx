import { ComponentType } from "react";
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

type ExtraProps = {
  grey?: boolean;
  ellipsis?: boolean;
};

const Any: ComponentType<any> = styled(
  ({ as: Component, grey, ellipsis, ...props }) => <Component {...props} />
)`
  opacity: ${(props) => (props.grey ? ".6" : 1)};

  ${(props) =>
    props.ellipsis &&
    `
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    `}
`;

export const P = (props: HTMLProps<HTMLParagraphElement> & ExtraProps) => (
  <Any as="p" {...props} />
);

export const Small = styled(P)`
  font-size: 1.2rem;
`;

export const Tiny = styled(P)`
  font-size: 1rem;
`;

export const Bold = (props: HTMLProps<HTMLSpanElement> & ExtraProps) => (
  <Any as="b" {...props} />
);

export const Semibold = styled(Bold)``;

export const Underline = (props: HTMLProps<HTMLSpanElement> & ExtraProps) => (
  <Any as="u" {...props} />
);

export const Span = (props: HTMLProps<HTMLSpanElement> & ExtraProps) => (
  <Any as="span" {...props} />
);
