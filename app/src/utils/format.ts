export function formatMs(ms: number) {
  return ms > 1000
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
