export function formatMs(ms: number) {
  return ms > 1000 * 60 * 60
    ? `${Math.round(ms / 1000 / 60 / 60)} h ${Math.ceil(ms / 1000 / 60) % 60} m`
    : ms > 1000 * 60
    ? `${Math.floor(ms / 1000 / 60)} m ${Math.ceil(ms / 1000) % 60} s`
    : ms > 1000
    ? `${Math.ceil((ms * 100) / 1000) / 100} s`
    : `${Math.ceil(ms * 100) / 100} ms`;
}

export function formatBytes(bytes: number) {
  return bytes > 1024 * 1024
    ? `${Math.ceil((bytes * 100) / 1024 / 1024) / 100} MiB`
    : bytes > 1024
    ? `${Math.ceil((bytes * 100) / 1024) / 100} KiB`
    : `${Math.ceil(bytes * 100) / 100} B`;
}

type Obj = {
  [key: string]: any;
};

export function removeUndefined(obj: Obj): Obj {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) =>
        value && typeof value === "object"
          ? [key, removeUndefined(value)]
          : [key, value]
      )
      .filter(([, value]) => value !== undefined)
  );
}
