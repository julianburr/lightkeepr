import { onSnapshot } from "firebase/firestore";
import invariant from "invariant";
import { useContext } from "react";

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

      // Since we might be updating multiple cache items, we collect all updates in a new
      // state object
      const newState: any = {};

      const items: any[] = [];
      snap.forEach(async (doc: any) => {
        const item = options?.mapItem
          ? await options.mapItem({ id: doc.id, ...doc.data() })
          : { id: doc.id, ...doc.data() };

        items.push(item);

        // If we can get the item document path, add the item itself also to the document
        // cache, this way we don't need to re-fetch items we already fetched from a list
        if (doc.ref?.path) {
          const documentCacheKey = `doc/${doc.ref?.path}`;
          newState[documentCacheKey] = { data: item };
        }
      });
      newState[cacheKey] = { data: items };

      setCache?.((state) => ({ ...state, ...newState }));
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
