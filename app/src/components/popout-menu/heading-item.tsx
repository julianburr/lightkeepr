import { ReactNode } from "react";
import styled from "styled-components";

const Heading = styled.h3`
  margin: 0;
  padding: 0.8rem 1.2rem 0.2rem;
  font-weight: 400;
  font-size: 1rem;
  opacity: 0.6;
  text-transform: uppercase;
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
