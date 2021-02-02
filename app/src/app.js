import { Suspense } from "react";
import { useAuth, useDocument } from "react-firebase-context";
import firebase from "firebase/app";

const provider = new firebase.auth.GoogleAuthProvider();

function Details() {
  const data = useDocument(
    firebase.firestore().collection("projects").doc("VqqFRnWyn6TcFsqqZyJV")
  );
  return <p>Project: {data?.name}</p>;
}

export function App() {
  const authUser = useAuth();
  console.log({ authUser });

  if (!authUser) {
    return (
      <button onClick={() => firebase.auth().signInWithPopup(provider)}>
        Login via Google
      </button>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hello {authUser.displayName}
        </a>
        <Suspense fallback={<p>Loading details...</p>}>
          <Details />
        </Suspense>
        <button onClick={() => firebase.auth().signOut()}>Logout</button>
      </header>
    </div>
  );
}

export default App;
