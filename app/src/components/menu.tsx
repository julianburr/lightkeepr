import { useRouter } from "next/router";
import { PropsWithChildren, ReactNode, useCallback } from "react";
import classnames from "classnames";
import styled from "styled-components";

import { interactive } from "src/@packages/sol/tokens";

import { CoreButton } from "./button";
import { GroupHeading } from "./text";
import classNames from "classnames";

const Container = styled.menu`
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;

  ul {
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 800px) {
    [data-mobile="true"] {
      display: none;
    }
  }
`;

const Li = styled.li`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  width: 100%;

  &.heading {
    margin: 2.4rem 0 0;
  }
`;

const CoreMenuItem = styled((props) => <CoreButton {...props} />)`
  border: 0 none;
  color: inherit;
  text-decoration: none;
  display: flex;
  flex: 1;
  text-align: left;
  flex-direction: row;
  align-items: center;
  transition: background 0.2s;
  padding: var(--sol--spacing-s);
  margin: 0.2rem calc(var(--sol--spacing-s) * -1) 0;
  border-radius: var(--sol--border-radius-s);

  ${interactive("lighter")}

  &:focus,
  &:hover {
    text-decoration: none;
  }

  &.backlink {
    font-family: "Playfair Display";
  }

  & svg {
    height: 1.1em;
    width: auto;
    margin: 0 0.6rem 0 0;
  }

  @media (min-width: 800px) {
    padding: 0.6rem;
    margin: 0.2rem -0.6rem 0;
  }
`;

type MenuItemProps = PropsWithChildren<{
  onClick?: (e: any) => void;
  href?: string;
  isBacklink?: boolean;
}>;

function MenuItem({ onClick, href, children, isBacklink }: MenuItemProps) {
  const router = useRouter();

  if (onClick) {
    return (
      <CoreMenuItem
        onClick={onClick}
        className={classnames({ backlink: isBacklink })}
      >
        {children}
      </CoreMenuItem>
    );
  }

  return (
    <CoreMenuItem
      href={href}
      className={classnames({
        backlink: isBacklink,
        active: href === router.asPath,
      })}
    >
      {children}
    </CoreMenuItem>
  );
}

type Item = {
  key?: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: (e: any) => void | Promise<void>;
  href?: string;
  mobile?: boolean;
  isBacklink?: boolean;
};

type ItemGroup = {
  key?: string;
  label: ReactNode;
  icon?: ReactNode;
  items: Item[] | ItemGroup[];
  mobile?: boolean;
};

type Items = (Item | ItemGroup)[];

type MenuProps = {
  items: Items;
};

export function Menu({ items }: MenuProps) {
  const renderItems = useCallback((items: Items) => {
    return (
      <ul>
        {items.map((item, index) => {
          if ("items" in item) {
            return (
              <Li
                data-mobile={item.mobile}
                key={index}
                className={classNames("heading", { mobile: item.mobile })}
              >
                <GroupHeading>
                  {item.icon}
                  <span>{item.label}</span>
                </GroupHeading>
                {renderItems(item.items)}
              </Li>
            );
          }
          return (
            <Li data-mobile={item.mobile} key={index}>
              <MenuItem
                onClick={item.onClick}
                href={item.href}
                isBacklink={item.isBacklink}
              >
                {item.icon}
                <span>{item.label}</span>
              </MenuItem>
            </Li>
          );
        })}
      </ul>
    );
  }, []);

  return <Container>{renderItems(items)}</Container>;
}
