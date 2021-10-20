import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export function LoginScreen() {
  return (
    <button onClick={() => signInWithRedirect(auth, provider)}>
      Login with Google
    </button>
  );
}
