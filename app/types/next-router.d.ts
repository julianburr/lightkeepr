declare module "next/router" {
  import { NextRouter } from "next/router";

  interface ParsedUrlQuery extends NodeJS.Dict<string> {}

  type FixedNextRouter<Query> = Omit<NextRouter, "query"> & {
    query: Query;
  };

  export function useRouter<Query = ParsedUrlQuery>(): FixedNextRouter<Query>;
}
