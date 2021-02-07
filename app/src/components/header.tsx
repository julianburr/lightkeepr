import styled from "styled-components";

import { Menu } from "./menu";

import { ReactComponent as LogoSvg } from "../assets/logo.svg";

const Container = styled.header`
  width: 100%;
  height: 7.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom: 0.1rem solid #f4f4f4;
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;

  @media (max-width: 800px) {
    height: 6rem;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 120rem;
  padding: 0 2.4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(LogoSvg)`
  height: 5rem;
  width: auto;

  @media (max-width: 800px) {
    height: 4rem;
  }
`;

export function Header() {
  return (
    <Container>
      <Inner>
        <Logo />
        <Menu />
      </Inner>
    </Container>
  );
}
