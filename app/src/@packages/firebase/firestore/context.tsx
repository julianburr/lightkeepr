import { Dispatch } from "react";
import { SetStateAction } from "react";
import { createContext, useState } from "react";
import { PropsWithChildren } from "react";

type Cache = {
  [key: string]: any;
};

type Void = () => void;

type FirestoreContextValue = {
  cache: Cache;
  setCache: Dispatch<SetStateAction<Cache>> | undefined;
};

export const FirestoreContext = createContext<FirestoreContextValue>({
  cache: {},
  setCache: undefined,
});

type FirestoreProviderProps = PropsWithChildren<Record<never, any>>;

export function FirestoreProvider(props: FirestoreProviderProps) {
  const [cache, setCache] = useState({});
  return <FirestoreContext.Provider value={{ cache, setCache }} {...props} />;
}
