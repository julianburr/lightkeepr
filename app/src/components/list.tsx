import Link from "next/link";
import { ComponentType, ReactNode } from "react";
import styled from "styled-components";

const Ul = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;

  & > * {
    margin-bottom: 0.4rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Li = styled.li`
  & > * {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1.2rem;
    border: 0.1rem solid rgba(0, 0, 0, 0.1);
    border-radius: 0.2rem;
    text-decoration: none;
    font: inherit;
    color: inherit;
  }

  & a:hover {
    border: 0.1rem solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.1);
  }
`;

const Item = styled.div``;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.1rem 0;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;

  a:hover & {
    text-decoration: underline;
  }
`;

const Status = styled.span``;

const Meta = styled.span`
  font-size: 1rem;
`;

type ListProps<T = any> = {
  items: T[];
  Item: ComponentType<{ item: T }>;
  getKey?: (item: T) => string;
  Empty?: ComponentType<{}>;
  Loading?: ComponentType<{}>;
  isLoading?: boolean;
  showLoadMore?: boolean;
  onLoadMore?: () => void | Promise<void>;
};

export function List({
  items,
  Item,
  getKey,
  Empty = () => <p>No items found</p>,
  Loading = () => <p>Loading...</p>,
  isLoading,
  showLoadMore,
  onLoadMore,
}: ListProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (!items?.length) {
    return <Empty />;
  }

  return (
    <>
      <Ul>
        {items.map((item) => (
          <Item key={getKey?.(item) || item?.id} item={item} />
        ))}
      </Ul>
    </>
  );
}

type ListItemProps = {
  href?: string;
  title?: ReactNode;
  meta?: ReactNode;
  status?: ReactNode;
};

export function ListItem({ href, title, meta, status }: ListItemProps) {
  return (
    <Li>
      {href ? (
        <Link href={href} passHref>
          <a>
            <Row>
              <Title>{title}</Title>
              {status && <Status>{status}</Status>}
            </Row>
            {meta && (
              <Row>
                <Meta>{meta}</Meta>
              </Row>
            )}
          </a>
        </Link>
      ) : (
        <Item>
          <Row>
            <Title>{title}</Title>
            {status && <Status>{status}</Status>}
          </Row>
          {meta && (
            <Row>
              <Meta>{meta}</Meta>
            </Row>
          )}
        </Item>
      )}
    </Li>
  );
}
