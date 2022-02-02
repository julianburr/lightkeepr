import Link from "next/link";
import { SetStateAction, ReactNode, Dispatch, ComponentProps } from "react";
import styled from "styled-components";

import { CoreButton } from "src/components/button";
import { P, Small } from "src/components/text";

import CheckSvg from "src/assets/icons/check.svg";

const Container = styled(CoreButton)<{ intent?: string }>`
  && {
    width: 100%;
    border: 0 none;
    border-radius: 0.3rem;
    padding: 1.2rem;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    line-height: 1.2;
    background: transparent;
    transition: background 0.2s;
    align-self: inherit;
    justify-self: inherit;
    height: auto;
    color: ${(props) =>
      props.intent === "danger" ? "var(--sol--palette-red-500)" : "inherit"};
    text-decoration: none;

    &:focus,
    &:hover {
      background: ${(props) =>
        props.intent === "danger"
          ? "var(--sol--palette-red-50)"
          : "var(--sol--palette-sand-50)"};
      color: ${(props) =>
        props.intent === "danger" ? "var(--sol--palette-red-600)" : "inherit"};
    }

    p {
      margin: 0;
    }
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const WrapIcon = styled.div`
  height: 1.2em;
  width: 1.2em;
  margin: 0 0.6rem 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  flex-shrink: 0;

  svg {
    height: 1em;
    width: auto;
    stroke-width: 0.3rem;
  }
`;

const WrapSelectable = styled(WrapIcon)``;

const WrapText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export type MenuItemObj = {
  key?: string;
  icon?: ReactNode;
  label: ReactNode;
  onClick?: (e: any) => void | Promise<void>;
  href?: ComponentProps<typeof Link>["href"];
  description?: ReactNode;
  selectable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  intent?: "danger";
};

type MenuItemProps = {
  item: MenuItemObj;
  setVisible: Dispatch<SetStateAction<boolean>>;
  element?: HTMLElement;
};

export function MenuItem({ item, setVisible, element }: MenuItemProps) {
  const containerProps = item.href
    ? { href: item.href }
    : {
        onClick: async (e: any) => {
          await item?.onClick?.(e);
          if (!e.defaultPrevented) {
            element?.focus?.();
            setVisible(false);
          }
        },
      };

  return (
    <>
      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
      <Container
        tabIndex={-1}
        data-focusable
        intent={item.intent}
        {...containerProps}
      >
        <Inner>
          {item.icon && <WrapIcon>{item.icon}</WrapIcon>}
          {item.selectable && (
            <WrapSelectable>{item.selected && <CheckSvg />}</WrapSelectable>
          )}
          <WrapText>
            <P>{item.label}</P>
            {item.description && <Small grey>{item.description}</Small>}
          </WrapText>
        </Inner>
      </Container>
    </>
  );
}
