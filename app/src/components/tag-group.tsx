import { PropsWithChildren } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3rem;
`;

type TagGroupProps = PropsWithChildren<{
  maxItems?: number | "auto";
}>;

export function TagGroup({ children }: TagGroupProps) {
  return <Container>{children}</Container>;
}
