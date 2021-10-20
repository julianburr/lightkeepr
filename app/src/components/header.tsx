import styled from "styled-components";

import LogoSvg from "../assets/logo.svg";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.6rem;
  border-bottom: 0.1rem solid rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  & svg {
    display: flex;
    height: 4.2rem;
    width: auto;
  }
`;

const Actions = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export function Header({ actions }) {
  return (
    <Container>
      <Logo>
        <LogoSvg />
      </Logo>
      <Actions>{actions}</Actions>
    </Container>
  );
}
