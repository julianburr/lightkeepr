import { useContext, useLayoutEffect } from "react";
import invariant from "invariant";
import { onSnapshot } from "firebase/firestore";

import { FirestoreContext } from "./context";

type UseCollectionOptions = {
  key: string;
  mapItem?: (item: any) => any;
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

    // HACK: react complains about setting state in the main component function body,
    // so we delay the state setting to the next tick here :/
    setTimeout(
      () => setCache?.((state) => ({ ...state, [cacheKey]: cacheItem })),
      0
    );

    onSnapshot(query, { includeMetadataChanges: true }, (snap: any) => {
      // HACK: firestore has the annoying habit to return incomplete lists from the cache
      // if you've loaded any items from the list before, which leads to flashing lists,
      // so we don't actually listen to any value from the cache here ... which is also
      // annoying because often the cache would be fine and a lot faster :/
      if (snap.metadata?.fromCache) {
        return;
      }
      const items: any[] = [];
      snap.forEach(async (doc: any) => {
        items.push(
          options?.mapItem
            ? await options.mapItem({ id: doc.id, ...doc.data() })
            : { id: doc.id, ...doc.data() }
        );
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
