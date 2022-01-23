import {
  ReactNode,
  ComponentProps,
  ComponentType,
  PropsWithChildren,
} from "react";
import Link from "next/link";
import styled from "styled-components";

import { ActionMenu } from "./action-menu";
import { P, Small } from "./text";
import { Button } from "./button";

const Ul = styled.ul<{ columns?: number; gap?: string }>`
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: ${(props) =>
    Array.from(new Array(props.columns || 1))
      .fill("1fr")
      .join(" ")};
  gap: ${(props) => props.gap || ".3rem"};
`;

const Li = styled.li`
  display: flex;
  margin: 0;
  list-style: none;

  & > div,
  & > button,
  & > a {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 1.2rem;
    border: 0 none;
    border-radius: 0.3rem;
    background: #f9f9f7;
    transition: background 0.2s;

    p {
      margin: 0;
    }
  }

  & > button,
  & > a {
    cursor: pointer;

    &:hover,
    &:focus {
      background: #f9f9f788;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 0.8rem 0 0;
`;

const WrapTags = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 2.4rem 0 0;
`;

type ListProps = {
  items: any[];
  Item: ComponentType<{ data: any }>;
  getKey?: (data: any) => string | number;
  columns?: 1 | 2 | 3;
  gap?: string;
};

export function List({
  items,
  Item,
  getKey = (data) => data.id,
  columns = 1,
  gap,
}: ListProps) {
  if (!items?.length) {
    return <p>No items</p>;
  }

  return (
    <Ul columns={columns} gap={gap}>
      {items.map((data: any) => (
        <Item key={getKey(data)} data={data} />
      ))}
    </Ul>
  );
}

type ListItemProps = PropsWithChildren<{
  href?: string;
  onClick?: (e: any) => void | Promise<void>;
  title: ReactNode;
  meta?: ReactNode;
  tags?: ReactNode;
  actions?: ComponentProps<typeof ActionMenu>["items"];
  disabled?: boolean;
}>;

export function ListItem({
  href,
  onClick,
  title,
  meta,
  tags,
  actions,
}: ListItemProps) {
  const content = (
    <>
      <Content>
        <P>{title}</P>
        {meta && <Small grey>{meta}</Small>}
      </Content>

      <WrapTags>{tags}</WrapTags>
      {!!actions?.length && (
        <ActionMenu items={actions} placement="bottom-end" />
      )}
    </>
  );

  if (href) {
    return (
      <Li>
        <Link href={href}>{content}</Link>
      </Li>
    );
  }

  if (onClick) {
    return (
      <Li>
        <button onClick={onClick}>{content}</button>
      </Li>
    );
  }

  return (
    <Li>
      <div>{content}</div>
    </Li>
  );
}
