import { ReactNode } from "react";
import styled from "styled-components";

const Heading = styled.p`
  margin: 0;
  padding: 0.5rem 1.2rem 0.2rem;
  font-size: 1.2rem;
  opacity: 0.6;
`;

type HeadingItemProps = {
  item: {
    label?: ReactNode;
    icon?: ReactNode;
  };
};

export function HeadingItem({ item }: HeadingItemProps) {
  return (
    <Heading>
      {item.icon}
      {item.label && <span>{item.label}</span>}
    </Heading>
  );
}
