import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 23rem;
  padding: 3rem;
`;

export function AuthLayout({ children }) {
  return <Container>{children}</Container>;
}
