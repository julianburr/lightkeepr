import { PropsWithChildren } from "react";
import styled from "styled-components";

import LogoSvg from "src/assets/logo.svg";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 1.8rem;

  svg {
    height: 8rem;
    width: auto;
    margin: 0 0 0.8rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 2.8em;
`;

const Content = styled.main`
  padding: 4rem;
  width: 100%;
  max-width: 36rem;
  background: #fff;
  box-shadow: 0 0.2rem 2.4rem rgba(0, 0, 0, 0.1);
  border-radius: 0.8rem;
  text-align: center;

  p {
    margin: 2.4rem 0 0;
  }

  hr {
    width: 30%;
    margin: 0 auto;
    padding: 0;
    border: 0 none;
    height: 0.1rem;
    background: #eee;
    display: flex;
  }
`;

type AuthLayoutProps = PropsWithChildren<Record<never, any>>;

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Container>
      <Logo>
        <LogoSvg />
        <Title>lightkeepr</Title>
      </Logo>

      <Content>{children}</Content>
    </Container>
  );
}
