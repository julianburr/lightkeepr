import styled from "styled-components";
import { getAuth } from "firebase/auth";

import { useAuthUser } from "../hooks/use-auth-user";

import { ProfileSetupScreen } from "../screens/setup/profile";
import { OrganisationSetupScreen } from "../screens/setup/organisation";
import { Header } from "../components/header";

const auth = getAuth();

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
  max-width: 80rem;
  padding: 2.6rem;
`;

export function SetupLayout() {
  const authUser = useAuthUser();

  return (
    <Container>
      <Header
        actions={<button onClick={() => auth.signOut()}>Logout</button>}
      />
      <Content>
        <Inner>
          {!authUser.user?.name ? (
            <ProfileSetupScreen />
          ) : (
            <OrganisationSetupScreen />
          )}
        </Inner>
      </Content>
    </Container>
  );
}
