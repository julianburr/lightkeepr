import { useContext } from "react";
import invariant from "invariant";
import { onSnapshot } from "firebase/firestore";

import { FirestoreContext, NotFoundError } from "./context";

type UseDocumentOptions = {
  key?: string;
  suspense?: boolean;
  fetch?: boolean;
  throw?: boolean;
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

    // HACK: react complains about setting state in the main component function body,
    // so we delay the state setting to the next tick here :/
    setTimeout(
      () => setCache?.((state: any) => ({ ...state, [cacheKey]: cacheItem })),
      0
    );
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

  if (cacheItem?.data === null && options?.throw !== false) {
    throw new NotFoundError({
      message: "Document not found",
      code: 404,
      query,
    });
  }

  return cacheItem?.data;
}
