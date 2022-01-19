import invariant from "invariant";
import { onSnapshot } from "firebase/firestore";
import { useContext } from "react";
import { FirestoreContext } from "./context";

type UseDocumentOptions = {
  key?: string;
  suspense?: boolean;
  fetch?: boolean;
};

export function useDocument(query: any, options?: UseDocumentOptions) {
  const { cache, setCache } = useContext(FirestoreContext);

  if (!fetch || !query) {
    return;
  }

  invariant(
    options?.key || query?.path,
    "You need to define a key for this document query."
  );
  const cacheKey = `doc/${options?.key || query?.path}`;

  let cacheItem = cache?.[cacheKey];
  if (cacheItem === undefined) {
    cacheItem = {};
    cacheItem.promise = new Promise((resolve) => {
      cacheItem.resolve = resolve;
    });

    setCache?.((state: any) => ({ ...state, [cacheKey]: cacheItem }));
    onSnapshot(query, (snap: any) => {
      setCache?.((state: any) => ({
        ...state,
        [cacheKey]: {
          data: snap.exists() ? { id: snap.id, ...snap.data() } : null,
        },
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
