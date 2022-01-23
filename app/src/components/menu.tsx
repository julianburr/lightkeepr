import { useRouter } from "next/router";
import {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useCallback,
} from "react";
import styled from "styled-components";
import { CoreButton } from "./button";

const Container = styled.menu`
  width: 100%;
  margin: 0;
  padding: 2rem;
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
  padding: 0;
  margin: 0;
  width: 100%;
`;

const Heading = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
  padding: 0.2rem 0.8rem;
  margin: 2.4rem 0 0;

  @media (min-width: 800px) {
    padding: 0.2rem 0.6rem;
  }
`;

const CoreMenuItem = styled(({ active, ...props }) => (
  <CoreButton {...props} />
))`
  margin: 0.1rem 0 0;
  padding: 0.8rem;
  border: 0 none;
  border-radius: 0.3rem;
  width: 100%;
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${(props) => (props.active ? "#f5f4f1" : "transparent")};
  transition: background 0.2s;

  &:focus,
  &:hover {
    color: inherit;
    text-decoration: none;
    background: ${(props) => (props.active ? "#f5f4f1" : "#f9f9f7")};
  }

  & svg {
    height: 1.1em;
    width: auto;
    margin: 0 0.6rem 0 0;
  }

  @media (min-width: 800px) {
    padding: 0.6rem;
  }
`;

type MenuItemProps = PropsWithChildren<{
  onClick?: (e: any) => void;
  href?: string;
  active?: boolean;
}>;

function MenuItem({ onClick, href, active, children }: MenuItemProps) {
  const router = useRouter();

  if (onClick) {
    return <CoreMenuItem onClick={onClick}>{children}</CoreMenuItem>;
  }

  return (
    <CoreMenuItem
      href={href}
      active={
        active !== undefined ? active : href ? href === router.asPath : false
      }
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
  active?: boolean;
};

type ItemGroup = {
  key?: string;
  label: ReactNode;
  icon?: ReactNode;
  items: Item[] | ItemGroup[];
  mobile?: boolean;
};

type Items = Item[] | ItemGroup[];

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
              <Li data-mobile={item.mobile} key={index}>
                <Heading>
                  {item.icon}
                  <span>{item.label}</span>
                </Heading>
                {renderItems(item.items)}
              </Li>
            );
          }
          return (
            <Li data-mobile={item.mobile} key={index}>
              <MenuItem
                onClick={item.onClick}
                href={item.href}
                active={item.active}
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
