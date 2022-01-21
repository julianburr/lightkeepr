import { SetStateAction, ReactNode, Dispatch } from "react";
import styled from "styled-components";

import { P, Small } from "../text";
import { Button } from "../button";

import CheckSvg from "src/assets/icons/check.svg";

const Container = styled(Button)`
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
    line-height: 1.1;
    background: rgba(0, 0, 0, 0);
    transition: background 0.2s;
    align-self: inherit;
    justify-self: inherit;
    height: auto;

    &:focus,
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    p {
      margin: 0;
    }
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const WrapIcon = styled.div`
  height: 1.1em;
  width: 1.1em;
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

  ${Small} {
    margin: 0.2rem 0 0;
  }
`;

export type MenuItemObj = {
  key?: string;
  icon?: ReactNode;
  label: ReactNode;
  onClick?: (e: any) => void | Promise<void>;
  href?: string;
  description?: ReactNode;
  selectable?: boolean;
  selected?: boolean;
  disabled?: boolean;
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
    <Container tabIndex={-1} data-focusable {...containerProps}>
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
  );
}
