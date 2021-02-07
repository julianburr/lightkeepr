import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    margin-top: 0.6rem;

    &:first-child {
      margin-top: 0;
    }
  }
`;

type ItemProps = {
  to?: string;
  inProgress?: boolean;
};

const Item = styled.div<ItemProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: inherit;
  text-decoration: none;
  padding: 1.8rem;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: box-shadow 0.2s;
  border: 0.1rem solid #f4f4f4;
  border-radius: 0.2rem;

  &:hover {
    box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.1);
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;

  & h2 {
    margin: 0;
    padding: 0;
    font-size: 1.6rem;
    font-weight: 400;
  }
`;

const Tag = styled.div`
  display: flex;
  align-self: center;
  font-size: 1.2rem;
  background: #f4f4f4;
  border-radius: 0.2rem;
  padding: 0.4rem 0.6rem;
  margin-left: 1.2rem;
  color: #999;
`;

const Meta = styled.p`
  margin: 0;
  padding: 0.4rem 0 0;
  color: #999;
  font-size: 1.2rem;s
`;

type ListItemProps = {
  title: string;
  tag?: string;
  to?: string;
  meta?: string;
  preview?: ReactNode;
  inProgress?: boolean;
};

export function ListItem({
  title,
  tag,
  to,
  meta,
  preview,
  inProgress,
}: ListItemProps) {
  return (
    <Item to={to} inProgress={inProgress} as={to ? Link : "div"}>
      <Left>
        <Title>
          <h2>{title}</h2>
          {tag && <Tag>{tag}</Tag>}
        </Title>
        {meta && <Meta>{meta}</Meta>}
      </Left>

      {preview && <Right>{preview}</Right>}
    </Item>
  );
}

export function List({ items, empty = <p>No items.</p>, Item }) {
  return (
    <Container>
      {items?.length ? items.map((item) => <Item data={item} />) : empty}
    </Container>
  );
}
