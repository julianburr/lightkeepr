import { useContext } from "react";
import invariant from "invariant";

import { FirestoreContext } from "./context";

type UseDocumentOptions = {
  key?: string;
  suspense?: boolean;
};

export function useDocument(query, options?: UseDocumentOptions) {
  const cacheKey = options?.key || query.path;
  invariant(cacheKey, "You need to define a key for this document query.");

  const { cache, setCache } = useContext(FirestoreContext);
  let cacheItem = cache[cacheKey];

  if (cacheItem === undefined) {
    cacheItem = {};
    cacheItem.promise = new Promise((resolve) => {
      cacheItem.resolve = resolve;
    });
    setCache((state) => ({ ...state, [cacheKey]: cacheItem }));

    query.onSnapshot((snap) => {
      const item = { id: snap.id, ...snap.data() };
      setCache((state) => ({
        ...state,
        [cacheKey]: { ...state[cacheKey], data: item },
      }));
      cacheItem?.resolve();
    });
  }

  if (options?.suspense === false) {
    return {
      data: cacheItem?.data,
      loading: cacheItem?.data === undefined && cacheItem?.promise,
    };
  }

  if (cacheItem?.data === undefined && cacheItem?.promise) {
    throw cacheItem.promise;
  }

  return cacheItem?.data;
}
