import { Dispatch, useContext, useMemo } from "react";
import { SetStateAction } from "react";
import { createContext, useState } from "react";
import { PropsWithChildren } from "react";

type NotFoundErrorArgs = {
  message?: string;
  code: number;
  query?: any;
};

export class NotFoundError extends Error {
  name: string;
  code: number;
  query: any;

  constructor({ query, code, message }: NotFoundErrorArgs) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.name = "NotFoundError";
    this.code = code;
    this.query = query;
  }
}

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
