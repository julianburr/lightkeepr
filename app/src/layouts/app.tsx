import { PropsWithChildren, useState } from "react";
import styled from "styled-components";
import { getAuth } from "firebase/auth";

import { useAuth } from "../@packages/firebase";
import { Header } from "../components/header";
import { Menu } from "../components/menu";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1024rem;
  padding: 2.6rem;
`;

type AppLayoutProps = PropsWithChildren<{
  menu?: any;
}>;

export function AppLayout({ children, menu }: AppLayoutProps) {
  const [open, setOpen] = useState(false);
  const authUser = useAuth();

  return (
    <Container>
      <Menu open={open} setOpen={setOpen} menu={menu} />
      <Header actions={<button onClick={() => setOpen(true)}>Menu</button>} />
      <Content>
        <Inner>{children}</Inner>
      </Content>
    </Container>
  );
}
