import React, { createContext, useState } from "react";

export const FirestoreContext = createContext({
  cache: undefined,
  setCache: undefined,
});

export function FirestoreProvider(props) {
  const [cache, setCache] = useState({});
  return <FirestoreContext.Provider value={{ cache, setCache }} {...props} />;
}
