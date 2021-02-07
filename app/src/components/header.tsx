import styled from "styled-components";

import { Menu } from "./menu";
import { Spacer } from "./spacer";
import { Avatar } from "./avatar";

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
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export function Header() {
  return (
    <Container>
      <Inner>
        <div>
          <Logo />
        </div>
        <Right>
          <Menu />
          <Spacer width="1.2rem" />
          <Avatar />
        </Right>
      </Inner>
    </Container>
  );
}
