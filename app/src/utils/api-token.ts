import { v4 as uuid } from "uuid";

export function generateApiToken() {
  return `lk_${uuid().replace(/-/g, "")}`;
}
