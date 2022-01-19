import invariant from "invariant";
import { onSnapshot } from "firebase/firestore";

type Cache = {
  [key: string]: any;
};

type UseCollectionOptions = {
  key: string;
  suspense?: boolean;
  fetch?: boolean;
};

let cache: Cache = {};

export function useCollection(query: any, options: UseCollectionOptions) {
  if (!fetch || !query) {
    return;
  }

  const cacheKey = options?.key;
  invariant(cacheKey, "You need to define a key for collections.");

  let cacheItem = cache[cacheKey];

  if (cacheItem === undefined) {
    cacheItem = {};
    cacheItem.promise = new Promise((resolve) => {
      cacheItem.resolve = resolve;
    });
    cache[cacheKey] = cacheItem;

    onSnapshot(query, (snap: any) => {
      let items: any[] = [];
      snap.forEach((doc: any) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      cache[cacheKey].data = items;
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
