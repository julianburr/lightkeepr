import styled from "styled-components";

import LogoSvg from "src/assets/logo.svg";
import { getAuth } from "firebase/auth";

const Container = styled.div`
  width: 100%;
  padding: 0 1.8rem;
  height: 6.8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  height: 6.8rem;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  overflow: hidden;

  svg {
    height: 5.8rem;
    width: auto;
  }
`;

const auth = getAuth();

export function TopBar() {
  return (
    <Container>
      <Inner>
        <Logo>
          <LogoSvg />
        </Logo>
      </Inner>
      <Inner>
        <button onClick={() => auth.signOut()}>Logout</button>
      </Inner>
    </Container>
  );
}
