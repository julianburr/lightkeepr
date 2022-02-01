import { useRouter } from "next/router";
import { useMemo } from "react";

type UseRunFiltersArgs = {
  runs: any[];
  gitMain: string;
};

export function useRunFilters({ runs, gitMain }: UseRunFiltersArgs) {
  const router = useRouter();

  const filters = useMemo(
    () => ({
      status: (router?.query?.status?.split(",") || []).filter(Boolean),
      branch: (router?.query?.branch?.split(",") || []).filter(Boolean),
    }),
    [router.query.status, router.query.branch]
  );

  const filterItems = useMemo(
    () => [
      {
        label: "Branches",
        items: runs
          .reduce<string[]>(
            (all, item) => {
              if (item.branch && !all.includes(item.branch)) {
                all.push(item.branch);
              }
              return all;
            },
            [gitMain]
          )
          .sort((a, b) => (a > b ? 1 : -1))
          .map((branch) => {
            const selected = filters.branch.includes(branch);
            return {
              label: branch,
              selectable: true,
              selected,
              onClick: (e: any) => {
                router.push({
                  query: {
                    ...router.query,
                    branch: selected
                      ? filters.branch.filter((b) => b !== branch).join(",")
                      : filters.branch.concat([branch]).join(","),
                  },
                });
              },
            };
          }),
      },
      {
        label: "Status",
        items: ["Passed", "Failed"].map((status) => {
          const selected = filters.status.includes(status.toLowerCase());
          return {
            label: status,
            selectable: true,
            selected: filters.status.includes(status.toLocaleLowerCase()),
            onClick: (e: any) => {
              e.preventDefault();
              router.push({
                query: {
                  ...router.query,
                  status: selected
                    ? filters.status
                        .filter((b) => b !== status.toLowerCase())
                        .join(",")
                    : filters.status.concat([status.toLowerCase()]).join(","),
                },
              });
            },
          };
        }),
      },
    ],
    [router.query.status, router.query.branch, gitMain]
  );

  return useMemo(
    () => ({
      filters,
      filterItems,
    }),
    [filters, filterItems]
  );
}
