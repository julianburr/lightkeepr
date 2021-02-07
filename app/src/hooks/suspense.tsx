import { createContext, useContext, useState } from "react";

export const SuspenseContext = createContext({
  cache: {},
  setCache: undefined,
});

export function SuspenseProvider(props) {
  const [cache, setCache] = useState({});
  return <SuspenseContext.Provider value={{ cache, setCache }} {...props} />;
}

export function useSuspense(promise, key) {
  const { cache, setCache } = useContext(SuspenseContext);
  let fromCache = cache[key];

  if (!fromCache) {
    setCache((state) => ({ ...state, [key]: promise }));
    promise.then((data) => {
      setCache((state) => ({ ...state, [key]: data }));
    });
    fromCache = promise;
  }

  if (typeof fromCache.then === "function") {
    throw fromCache;
  }

  return fromCache;
}
