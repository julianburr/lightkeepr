import { v4 as uuid } from "uuid";

export function generateApiKey() {
  return `lk_${uuid().replace(/-/g, "")}`;
}
