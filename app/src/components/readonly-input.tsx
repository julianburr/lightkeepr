import { ReactNode } from "react";
import { Value } from "./value";

type ReadonlyInputProps = {
  value?: ReactNode;
};

export function ReadonlyInput({ value }: ReadonlyInputProps) {
  return <Value>{value || "—"}</Value>;
}
