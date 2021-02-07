import { ReactNode } from "react";
import styled from "styled-components";

type ContainerProps = {
  end?: boolean;
  margin?: boolean;
};

const Container = styled.div<ContainerProps>`
  margin-top: ${(props) => (props.margin ? "1.2rem" : 0)};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.end ? "flex-end" : "flex-start")};

  & > * {
    margin-left: 0.6rem;

    &:first-child {
      margin-left: 0;
    }
  }
`;

type ButtonProps = {
  children: ReactNode;
  end?: boolean;
  margin?: boolean;
};

export function ButtonBar({ children, end, margin = true }: ButtonProps) {
  return (
    <Container end={end} margin={margin}>
      {children}
    </Container>
  );
}
