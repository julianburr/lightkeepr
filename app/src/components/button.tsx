import Link, { LinkProps } from "next/link";
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
import styled from "styled-components";

import { interactive } from "src/@packages/sol/tokens";

import MoreSvg from "src/assets/icons/outline/dots-vertical.svg";

type AnchorTagProps = PropsWithChildren<LinkProps>;

type ButtonTagProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type CoreButtonProps = AnchorTagProps | ButtonTagProps;

export const CoreButton = forwardRef(function CoreButton(
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
    if ("onClick" in props) {
      // It's a link with both a `href` and an `onClick` prop
      return <a ref={ref} {...props} />;
    }

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
      type="button"
      {...(props as ButtonTagProps)}
      onClick={handleClick}
      disabled={loading || props.disabled}
    />
  );
});

type ContainerProps = {
  intent?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: boolean;
  fullWidth?: boolean;
};

// HACK: this is just to clean up the props we use to determine certain styles
// so they don't end up in `CoreButton` :/
const _CoreButton = forwardRef(function _CoreButton(
  { intent, icon, fullWidth, ...props }: ContainerProps,
  ref
) {
  return <CoreButton ref={ref} {...props} />;
});

const Container = styled(_CoreButton)`
  --sol--button-size: ${({ size }) =>
    size === "small"
      ? "var(--sol--input-height-s)"
      : size === "large"
      ? "var(--sol--input-height-l)"
      : "var(--sol--input-height-m)"};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin: 0;
  transition: border 0.2s, background 0.2s, color 0.2s;
  font-family: "Playfair Display";
  font-size: 1em;
  border-radius: var(--sol--border-radius-s);
  position: relative;

  padding: ${({ icon, size }) =>
    icon
      ? "0"
      : size === "small"
      ? "0 var(--sol--spacing-m)"
      : size === "large"
      ? "0 var(--sol--spacing-xl)"
      : "0 var(--sol--spacing-l)"};

  height: var(--sol--button-size);
  width: ${({ icon, fullWidth }) =>
    icon ? "var(--sol--button-size)" : fullWidth ? "100%" : "auto"};

  ${({ intent }) => interactive(intent!)}

  svg {
    height: ${({ size }) =>
      size === "large" ? "1.3em" : size === "small" ? "1em" : "1em"};
    width: auto;
    margin: 0 -0.6rem;
    filter: grayscale(1);
    transition: filter 0.2s;

    & + span {
      margin: 0 0 0 var(--sol--spacing-m);
    }
  }

  &:hover,
  &:focus {
    text-decoration: none;

    svg {
      filter: grayscale(0);
    }
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

const WrapBadge = styled.span`
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
`;

type ButtonProps = ComponentProps<typeof CoreButton> &
  Omit<ContainerProps, "icon"> & {
    icon?: ReactNode;
    badge?: ReactNode;
    target?: string;
  };

export const Button = forwardRef(function Button(
  { children, icon, intent = "secondary", badge, ...props }: ButtonProps,
  ref: Ref<any>
) {
  return (
    <>
      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
      <Container
        ref={ref}
        icon={!!icon && !children}
        intent={intent}
        {...props}
      >
        {icon}
        {children && <span>{children}</span>}
        {badge && <WrapBadge>{badge}</WrapBadge>}
      </Container>
    </>
  );
});

export const ActionButton = forwardRef(function ActionButton(
  props: ButtonProps,
  ref
) {
  return <Button intent="ghost" icon={<MoreSvg />} ref={ref} {...props} />;
});
