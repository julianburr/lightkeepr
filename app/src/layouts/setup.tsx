import "src/utils/firebase";

import { getAuth } from "firebase/auth";
import Head from "next/head";
import { PropsWithChildren } from "react";
import styled from "styled-components";

import { Button } from "src/components/button";
import { Suspense } from "src/components/suspense";
import { TopBar } from "src/components/top-bar";

import LogoSvg from "src/assets/logo.svg";

const auth = getAuth();

const Logo = styled.div`
  height: 6.8rem;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
  margin: 0 0 0 -0.6rem;
  position: relative;
  z-index: 2;

  svg {
    height: 5.4rem;
    width: auto;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.main`
  padding: 4.8rem 2.4rem;
  width: 100%;
  max-width: 46rem;
  display: flex;
  flex-direction: column;
`;

type SetupLayoutProps = PropsWithChildren<Record<never, any>>;

export function SetupLayout({ children }: SetupLayoutProps) {
  return (
    <>
      <Head>
        <title>Lightkeepr</title>
      </Head>
      <Container>
        <TopBar
          logo={
            <Logo>
              <LogoSvg />
            </Logo>
          }
          actions={<Button onClick={() => auth.signOut()}>Logout</Button>}
        />
        <Suspense fallback={null}>
          <Content>{children}</Content>
        </Suspense>
      </Container>
    </>
  );
}
