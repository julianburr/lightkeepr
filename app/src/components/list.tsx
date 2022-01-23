import { ComponentType, PropsWithChildren } from "react";
import Link from "next/link";
import styled from "styled-components";

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

  @media (min-width: 600px) {
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
    background: #f9f9f7;
    transition: background 0.2s;
    color: inherit;
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
      background: #f5f4f1;
      color: inherit;
      text-decoration: none;
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
  disabled?: boolean;
}>;

export function ListItem({ href, onClick, children, ...props }: ListItemProps) {
  if (href) {
    return (
      <Li {...props}>
        <Link href={href}>
          <a>{children}</a>
        </Link>
      </Li>
    );
  }

  if (onClick) {
    return (
      <Li {...props}>
        <button onClick={onClick}>{children}</button>
      </Li>
    );
  }

  return (
    <Li {...props}>
      <div>{children}</div>
    </Li>
  );
}
