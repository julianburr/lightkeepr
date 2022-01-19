import { useContext } from "react";
import invariant from "invariant";
import { onSnapshot } from "firebase/firestore";

import { FirestoreContext } from "./context";

type UseCollectionOptions = {
  key: string;
  suspense?: boolean;
  fetch?: boolean;
};

export function useCollection(query: any, options: UseCollectionOptions) {
  const { cache, setCache } = useContext(FirestoreContext);

  if (!fetch || !query) {
    return;
  }

  invariant(options?.key, "You need to define a key for collections.");
  const cacheKey = `collection/${options.key}`;

  let cacheItem = cache[cacheKey];

  if (cacheItem === undefined) {
    cacheItem = {};
    cacheItem.promise = new Promise((resolve) => {
      cacheItem.resolve = resolve;
    });
    setCache?.((state) => ({ ...state, [cacheKey]: cacheItem }));

    onSnapshot(query, (snap: any) => {
      const items: any[] = [];
      snap.forEach((doc: any) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setCache?.((state) => ({ ...state, [cacheKey]: { data: items } }));
      cacheItem?.resolve();
    });
  }

  if (options?.suspense === false) {
    return {
      data: cacheItem?.item,
      loading: cacheItem?.data === undefined && cacheItem?.promise,
    };
  }

  if (cacheItem?.data === undefined && cacheItem?.promise) {
    throw cacheItem.promise;
  }

  return cacheItem?.data;
}
