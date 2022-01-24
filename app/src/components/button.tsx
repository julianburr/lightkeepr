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
  intend?: "primary" | "secondary";
  weight?: "default" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: boolean;
  fullWidth?: boolean;
};

function getFontSize(props: ContainerProps) {
  return props.size === "small" ? ".9em" : "1em";
}

function getIconSize(props: ContainerProps) {
  return props.size === "large" ? "1.4em" : "1.2em";
}

function getHeight(props: ContainerProps) {
  return props.size === "small"
    ? "2.8rem"
    : props.size === "large"
    ? "4.4rem"
    : "3.6rem";
}

function getWidth(props: ContainerProps) {
  return props.icon ? getHeight(props) : props.fullWidth ? "100%" : "auto";
}

function getPadding(props: ContainerProps) {
  return props.icon
    ? "0"
    : props.size === "small"
    ? "0 1.2rem"
    : props.size === "large"
    ? "0 2.4rem"
    : "0 1.8rem";
}

function getBackground(props: ContainerProps) {
  return props.weight === "default"
    ? props.intend === "primary"
      ? "#3dc5ce"
      : "#e0dfd8"
    : "transparent";
}

function getBackgroundHover(props: ContainerProps) {
  return props.weight === "default"
    ? props.intend === "primary"
      ? "#2eb5bd"
      : "#dad9d0"
    : props.weight === "ghost"
    ? "#dad9d044"
    : "transparent";
}

function getBorder(props: ContainerProps) {
  return props.weight === "outline" ? ".1rem solid #dad9d088" : "0 none";
}

function getBorderHover(props: ContainerProps) {
  return props.weight === "outline" ? ".1rem solid #dad9d0" : "0 none";
}

function getColor(props: ContainerProps) {
  return props.weight === "default" && props.intend === "primary"
    ? "#fff"
    : "#222";
}

// HACK: this is just to clean up the props we use to determine certain styles
// so they don't end up in `CoreButton` :/
const _CoreButton = forwardRef(function _CoreButton(
  { weight, intend, icon, fullWidth, ...props }: ContainerProps,
  ref
) {
  return <CoreButton ref={ref} {...props} />;
});

const Container = styled(_CoreButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: ${getFontSize};
  height: ${getHeight};
  background: ${getBackground};
  border: ${getBorder};
  border-radius: 0.3rem;
  color: ${getColor};
  text-decoration: none;
  margin: 0;
  padding: ${getPadding};
  width: ${getWidth};
  transition: border 0.2s, background 0.2s, color 0.2s;
  font-family: "Playfair Display";

  svg {
    height: ${getIconSize};
    width: auto;
    margin: 0 -0.6rem;
    filter: grayscale(1);
    transition: filter 0.2s;

    & + span {
      margin: 0 0 0 1.2rem;
    }
  }

  &:hover,
  &:focus {
    color: ${getColor};
    text-decoration: none;
    border: ${getBorderHover};
    background: ${getBackgroundHover};

    svg {
      filter: grayscale(0);
    }
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

type ButtonProps = ComponentProps<typeof CoreButton> &
  Omit<ContainerProps, "icon"> & {
    icon?: ReactNode;
  };

export const Button = forwardRef(function Button(
  {
    children,
    icon,
    weight = "default",
    intend = "secondary",
    ...props
  }: ButtonProps,
  ref: Ref<any>
) {
  return (
    <>
      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
      <Container
        ref={ref}
        icon={icon && !children}
        weight={weight}
        intend={intend}
        {...props}
      >
        {icon}
        {children && <span>{children}</span>}
      </Container>
    </>
  );
});
