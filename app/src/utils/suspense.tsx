let cache = {};

export function useSuspense(getPromise, key) {
  let fromCache = cache[key];

  if (typeof fromCache?.then === "function" || fromCache instanceof Error) {
    throw fromCache;
  }

  if (fromCache === undefined) {
    const promise = getPromise()
      .then((data) => {
        cache[key] = data;
      })
      .catch((e) => {
        cache[key] = e;
      });
    cache[key] = promise;
    throw cache[key];
  }

  return cache[key];
}
