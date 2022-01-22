import { PropsWithChildren } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: -0.1rem;

  & > * {
    margin: 0.1rem;
  }
`;

type TagGroupProps = PropsWithChildren<{
  maxItems?: number | "auto";
}>;

export function TagGroup({ children }: TagGroupProps) {
  return <Container>{children}</Container>;
}
