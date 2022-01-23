declare module "next/router" {
  import { NextRouter } from "next/router";

  type FixedNextRouter<Query> = Omit<NextRouter, "query"> & {
    query: Query;
  };

  export function useRouter<
    Query = NodeJS.Dict<string>
  >(): FixedNextRouter<Query>;
}
