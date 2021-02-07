import { ReactNode } from "react";
import styled from "styled-components";

type ContainerProps = {
  failure?: boolean;
  warning?: boolean;
  success?: boolean;
};

const Container = styled.div<ContainerProps>`
  background: yellow;
  padding: 1.2rem;
  border-radius: 0.2rem;
`;

type BannerProps = {
  failure?: boolean;
  warning?: boolean;
  success?: boolean;
  children: ReactNode;
};

export function Banner({ failure, warning, success, children }: BannerProps) {
  return (
    <Container failure={failure} warning={warning} success={success}>
      {children}
    </Container>
  );
}
