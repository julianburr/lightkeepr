import Link from "next/link";
import {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  ComponentProps,
} from "react";
import styled from "styled-components";

import { Button, CoreButton } from "src/components/button";

function getColumns(columns?: number, maxColumns?: number) {
  return Array.from(
    new Array(
      columns ? (maxColumns ? Math.min(columns, maxColumns) : columns) : 1
    )
  )
    .fill("1fr")
    .join(" ");
}

const Ul = styled.ul<{ columns?: number; gap?: string }>`
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props) => props.gap || ".3rem"};

  @media (min-width: 800px) {
    grid-template-columns: ${(props) => getColumns(props.columns, 2)};
  }

  @media (min-width: 1000px) {
    grid-template-columns: ${(props) => getColumns(props.columns)};
  }
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
    transition: background 0.2s;
    background: var(--sol--container-light-background);
    color: var(--sol--container-light-foreground);
    text-decoration: none;

    p {
      margin: 0;
    }
  }

  & > button,
  & > a {
    cursor: pointer;

    &:hover,
    &:focus {
      color: inherit;
      text-decoration: none;
      background: var(--sol--container-light-hover-background);
    }
  }
`;

const WrapButton = styled.div`
  width: 100%;
  display:flex
  align-items:center;
  justify-content:center;
  margin: .8rem 0 0;
`;

type ListProps = {
  items: any[];
  Item: ComponentType<{ data: any; index: number; items: any[] }>;
  getKey?: (data: any) => string | number;
  columns?: 1 | 2 | 3;
  gap?: string;
  loadMore?: () => void | Promise<void>;
  emptyView?: ReactNode;
};

export function List({
  items,
  Item,
  getKey = (data) => data.id,
  columns = 1,
  gap,
  loadMore,
  emptyView = <p>No items</p>,
}: ListProps) {
  if (!items?.length) {
    return <>{emptyView}</>;
  }

  return (
    <>
      <Ul columns={columns} gap={gap}>
        {items.map((data: any, index) => (
          <Item
            key={getKey(data) || index}
            data={data}
            index={index}
            items={items}
          />
        ))}
      </Ul>
      {loadMore && (
        <WrapButton>
          <Button onClick={loadMore}>Load more</Button>
        </WrapButton>
      )}
    </>
  );
}

type ListItemProps = PropsWithChildren<{
  href?: ComponentProps<typeof Link>["href"];
  onClick?: (e: any) => void | Promise<void>;
  disabled?: boolean;
}>;

export function ListItem({ children, href, onClick, ...props }: ListItemProps) {
  if (href || onClick) {
    return (
      <Li {...props}>
        <CoreButton href={href} onClick={onClick}>
          {children}
        </CoreButton>
      </Li>
    );
  }

  return (
    <Li {...props}>
      <div>{children}</div>
    </Li>
  );
}
