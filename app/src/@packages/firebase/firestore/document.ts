import { useContext } from "react";
import invariant from "invariant";
import { onSnapshot } from "firebase/firestore";

import { FirestoreContext } from "./context";

type UseDocumentOptions = {
  key?: string;
  suspense?: boolean;
  fetch?: boolean;
};

let cache = {};

export function useDocument(query, options?: UseDocumentOptions) {
  if (!fetch || !query) {
    return;
  }

  const cacheKey = options?.key || query?.path;
  invariant(cacheKey, "You need to define a key for this document query.");

  let cacheItem = cache[cacheKey];
  if (cacheItem === undefined) {
    cacheItem = {};
    cacheItem.promise = new Promise((resolve) => {
      cacheItem.resolve = resolve;
    });

    cache[cacheKey] = cacheItem;
    onSnapshot(query, (snap) => {
      const item = { id: snap.id, ...snap.data() };
      cache[cacheKey].data = item;
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
