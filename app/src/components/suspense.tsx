import { ComponentProps, Suspense as OriginalSuspense, useState } from "react";

export function Suspense({
  fallback,
  ...props
}: ComponentProps<typeof OriginalSuspense>) {
  // HACK: Suspense not suported on SSR yet :/
  // https://nextjs.org/docs/advanced-features/react-18
  if (typeof window === "undefined") {
    return <>{fallback}</>;
  }

  return <OriginalSuspense fallback={fallback} {...props} />;
}
