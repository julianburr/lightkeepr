import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAuth } from "firebase/auth";

let resolveUserPromise: any;
const userPromise = new Promise((resolve) => {
  resolveUserPromise = resolve;
});

export const AuthContext = createContext<any>(undefined);

type AuthProviderProps = PropsWithChildren<Record<never, any>>;

export function AuthProvider(props: AuthProviderProps) {
  const [authUser, setAuthUser] = useState<any>(userPromise);

  useEffect(() => {
    const auth = getAuth();
    auth?.onAuthStateChanged?.((user) => {
      console.log();
      setAuthUser(user);
      resolveUserPromise?.();
    });
  }, []);

  const value = useMemo(() => ({ authUser, setAuthUser }), [authUser]);

  return <AuthContext.Provider value={value} {...props} />;
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
