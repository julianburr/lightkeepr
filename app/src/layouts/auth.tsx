import firebase from "firebase/app";
import styled from "styled-components";

const provider = new firebase.auth.GoogleAuthProvider();

const Container = styled.div`
  width: 100%;
  padding: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export function AuthLayout() {
  return (
    <Container>
      <button onClick={() => firebase.auth().signInWithRedirect(provider)}>
        Login with Google
      </button>
    </Container>
  );
}
