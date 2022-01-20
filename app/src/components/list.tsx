import Link from "next/link";
import { ComponentType } from "react";
import { PropsWithChildren } from "react";
import styled from "styled-components";

const Ul = styled.ul<{ columns?: number; gap?: string }>`
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: ${(props) =>
    Array.from(new Array(props.columns || 1))
      .fill("1fr")
      .join(" ")};
  gap: ${(props) => props.gap};
`;

const Li = styled.li`
  display: flex;
  flex-direction: column;
  margin: 0;
  list-style: none;

  & > div,
  & > a {
    display: flex;
    flex-direction: column;
    padding: 1.2rem 1.8rem;
    border: 0.1rem solid rgba(0, 0, 0, 0.1);
    border-radius: 0.6rem;

    &:hover,
    &:focus {
      border: 0.1rem solid rgba(0, 0, 0, 0.2);
    }

    p {
      margin: 0;
    }
  }
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
  gap = ".8rem",
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
}>;

export function ListItem({ href, children }: ListItemProps) {
  if (href) {
    return (
      <Li>
        <Link href={href}>
          <a>{children}</a>
        </Link>
      </Li>
    );
  }

  return (
    <Li>
      <div>{children}</div>
    </Li>
  );
}
