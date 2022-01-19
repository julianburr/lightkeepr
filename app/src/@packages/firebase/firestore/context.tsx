import { createContext, useState } from "react";
import { PropsWithChildren } from "react";

export const FirestoreContext = createContext({
  cache: {},
  setCache: (_: any): any => {},
});

type FirestoreProviderProps = PropsWithChildren<Record<never, any>>;

export function FirestoreProvider(props: FirestoreProviderProps) {
  const [cache, setCache] = useState({});
  return <FirestoreContext.Provider value={{ cache, setCache }} {...props} />;
}
