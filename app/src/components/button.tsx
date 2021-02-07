import { ReactNode, useCallback, useState } from "react";
import { Link, LinkProps } from "react-router-dom";
import styled from "styled-components";

type ContainerProps = {
  primary?: boolean;
  destructive?: boolean;
  to?: LinkProps["to"];
  loading?: boolean;
  disabled?: boolean;
};

const Container = styled.button<ContainerProps>`
  background: ${(props) =>
    props.primary ? "#5eafe7" : props.destructive ? "#e00" : "#f4f4f4"};
  color: ${(props) => (props.primary || props.destructive ? "#fff" : "#222")};
  padding: 0.6rem 1.2rem;
  border-radius: 0.2rem;
  border: 0 none;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  text-decoration: none;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.1);
    background: ${(props) =>
      props.primary ? "#4492c8" : props.destructive ? "#c00" : "#dfdfdf"};
  }

  &:active {
    transform: translateY(0.1rem);
  }
`;

const Icon = styled.span`
  margin-right: 0.4rem;

  & svg {
    height: 1.6rem;
    width: auto;
  }
`;

type ButtonProps = {
  children: ReactNode;
  primary?: boolean;
  destructive?: boolean;
  icon?: ReactNode;
  to?: string;
  onClick?: (e: any) => void | Promise<void>;
  type?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  children,
  primary,
  destructive,
  icon,
  onClick,
  to,
  type = "button",
  disabled,
  loading,
}: ButtonProps) {
  const [stateLoading, setStateLoading] = useState(false);

  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        setStateLoading(true);
        Promise.resolve(onClick(e)).then(() => setStateLoading(false));
      }
    },
    [onClick]
  );

  return (
    <Container
      as={to ? Link : "button"}
      to={to}
      primary={primary}
      destructive={destructive}
      type={to ? undefined : type}
      loading={loading || stateLoading}
      disabled={disabled || loading || stateLoading}
      onClick={handleClick}
    >
      {icon && <Icon>{icon}</Icon>}
      <span>{children}</span>
    </Container>
  );
}
