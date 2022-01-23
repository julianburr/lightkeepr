import { Dispatch, useContext, useMemo } from "react";
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
  clearCache: Void | undefined;
};

export const FirestoreContext = createContext<FirestoreContextValue>({
  cache: {},
  setCache: undefined,
  clearCache: undefined,
});

type FirestoreProviderProps = PropsWithChildren<Record<never, any>>;

export function FirestoreProvider(props: FirestoreProviderProps) {
  const [cache, setCache] = useState({});

  const value = useMemo(
    () => ({ cache, setCache, clearCache: () => setCache({}) }),
    [cache]
  );

  return <FirestoreContext.Provider value={value} {...props} />;
}

export function useFirestore() {
  return useContext(FirestoreContext);
}
