import {
  ComponentProps,
  ReactNode,
  forwardRef,
  Ref,
  DetailedHTMLProps,
  PropsWithChildren,
  ButtonHTMLAttributes,
  useState,
  useCallback,
} from "react";
import Link, { LinkProps } from "next/link";
import styled from "styled-components";

type AnchorTagProps = PropsWithChildren<LinkProps>;

type ButtonTagProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type CoreButtonProps = AnchorTagProps | ButtonTagProps;

const CoreButton = forwardRef(function CoreButton(
  props: CoreButtonProps,
  ref: Ref<any>
) {
  // "Smart" loading state handler, whenever an aysnc function is passed into
  // the `onClick` prop
  const [loading, setLoading] = useState(false);
  const onClick = "onClick" in props ? props.onClick : undefined;
  const handleClick = useCallback(
    async (e) => {
      if (onClick) {
        setLoading(true);
        await onClick(e);
        setLoading(false);
      }
    },
    [onClick]
  );

  if ("href" in props) {
    // It's a link, disguised as a button
    const { href, ...rest } = props;
    return (
      <Link href={href}>
        <a ref={ref} {...rest}>
          {rest.children}
        </a>
      </Link>
    );
  }

  // It's a button
  return (
    <button
      ref={ref}
      {...(props as ButtonTagProps)}
      onClick={handleClick}
      disabled={loading || props.disabled}
    />
  );
});

const Container = styled(CoreButton)<{
  intend?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}>`
  align-self: flex-start;
  justify-self: flex-start;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${(props) =>
    props.size === "small"
      ? "2.8rem"
      : props.size === "large"
      ? "4.4rem"
      : "3.6rem"};
  background: ${(props) =>
    props.intend === "primary" ? "#5B93E7" : "transparent"};
  border: 0.1rem solid rgba(0, 0, 0, 0.1);
  border-radius: 0.3rem;
  color: ${(props) => (props.intend === "primary" ? "#fff" : "#000")};
  text-decoration: none;
  padding: ${(props) =>
    props.size === "small"
      ? "0 1.2rem"
      : props.size === "large"
      ? "0 2.4rem"
      : "0 1.8rem"};
  margin: 0;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  transition: border 0.2s, background 0.2s;

  svg {
    height: 1.2em;
    width: auto;

    filter: grayscale(1);
    transition: filter 0.2s;

    & + span {
      margin: 0 0 0 0.8rem;
    }
  }

  &:hover,
  &:focus {
    color: ${(props) => (props.intend === "primary" ? "#fff" : "#000")};
    text-decoration: none;
    border-color: rgba(0, 0, 0, 0.2);
    background: ${(props) =>
      props.intend === "primary" ? "#4A80D2" : "transparent"};

    svg {
      filter: grayscale(0);
    }
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

type ButtonProps = ComponentProps<typeof Container> & {
  icon?: ReactNode;
};

export const Button = forwardRef(function Button(
  { children, icon, ...props }: ButtonProps,
  ref: Ref<any>
) {
  return (
    <Container ref={ref} {...props}>
      {icon}
      {children && <span>{children}</span>}
    </Container>
  );
});
