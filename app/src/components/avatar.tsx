import firebase from "firebase/app";
import styled from "styled-components";
import { useAuth } from "../hooks/@firebase";

import { ActionMenu } from "./action-menu";

const Container = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  background-color: green;
  border-radius: 50%;
  border: 0 none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
  overflow: hidden;

  & span {
    font-size: 1.6rem;
    font-weight: 600;
  }

  & img {
    object-fit: fill;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const items = [
  {
    label: "Profile",
    path: "/profile",
  },
  {
    label: "Logout",
    onClick: () => firebase.auth().signOut(),
  },
];

export function Avatar() {
  const authUser = useAuth();

  return (
    <ActionMenu items={items} placement="bottom-end">
      <Container>
        <span>{authUser.displayName[0]}</span>
        {authUser.photoURL && (
          <img src={authUser.photoURL} alt={authUser.displayName[0]} />
        )}
      </Container>
    </ActionMenu>
  );
}
