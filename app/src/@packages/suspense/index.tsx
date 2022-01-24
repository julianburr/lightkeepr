import invariant from "invariant";
import { createContext, useContext } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { PropsWithChildren } from "react";
import { SetStateAction } from "react";
import { Dispatch } from "react";

type Cache = {
  [key: string]: {
    promise?: Promise<any>;
    resolve?: (value: any) => void;
    data?: any;
    error?: Error;
  };
};

type SuspenseContextValue = {
  cache: Cache;
  setCache?: Dispatch<SetStateAction<Cache>>;
};

const SuspenseContext = createContext<SuspenseContextValue>({
  cache: {},
  setCache: undefined,
});

export function SuspenseProvider(props: PropsWithChildren<Record<never, any>>) {
  const [cache, setCache] = useState<Cache>({});
  const value = useMemo(() => ({ cache, setCache }), [cache, setCache]);
  return <SuspenseContext.Provider {...props} value={value} />;
}

type Options = {
  key: string;
  fetch?: boolean;
};

const tmpCache: Cache = {};

export function useSuspense(getPromise: () => Promise<any>, options: Options) {
  const { cache, setCache } = useContext(SuspenseContext);

  if (options.fetch === false) {
    return;
  }

  invariant(options.key, "You must define a cache key");
  invariant(
    cache && setCache,
    "Cache not found in context, make sure you add the `SuspenseProvider` to your app"
  );

  let cacheItem = cache[options.key] || tmpCache[options.key];
  if (cacheItem === undefined) {
    cacheItem = {};
    cacheItem.promise = getPromise();
    cacheItem.promise
      .then((data) => {
        setCache?.((state) => ({ ...state, [options.key]: { data } }));
      })
      .catch((e: Error) => {
        console.error(e);
        setCache?.((state) => ({ ...state, [options.key]: { error: e } }));
      });

    // HACK: react complains about setting state in the main component function body,
    // so we delay the state setting to the next tick here :/ Since we still want to
    // avoid multiple requests for the same resource, we use a local temporary cache
    // for the time between the first call and the `setCache` for the actual cache...
    tmpCache[options.key] = cacheItem;
    setTimeout(
      () => setCache?.((state) => ({ ...state, [options.key]: cacheItem })),
      0
    );
  }

  if (cacheItem?.data === undefined) {
    if (cacheItem?.promise) {
      throw cacheItem.promise;
    }

    if (cacheItem?.error) {
      throw cacheItem.error;
    }
  }

  return cacheItem?.data;
}
