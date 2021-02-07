import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from "firebase/app";

let resolveUserPromise;
let userPromise = new Promise((resolve) => {
  resolveUserPromise = resolve;
});

export const AuthContext = createContext<any>(undefined);

export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState<any>(userPromise);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setAuthUser(user);
      resolveUserPromise();
    });
  }, []);

  return <AuthContext.Provider value={{ authUser, setAuthUser }} {...props} />;
}

type UseAuthOptions = {
  suspense?: boolean;
};

export function useAuth(options?: UseAuthOptions) {
  const { authUser } = useContext(AuthContext);

  if (options?.suspense === false) {
    return {
      data: authUser,
      loading: typeof authUser?.then === "function",
    };
  }

  if (typeof authUser?.then === "function") {
    throw authUser;
  }

  return authUser;
}
