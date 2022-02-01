const REGRESSION_THRESHOLD = 10;

type Item = {
  value: number;
  displayValue: any;
  report?: any;
};

export type Regression = {
  type: "immediate" | "trend";
  item: Item;
  prevItem: Item;
  regression: number;
  commit?: string;
  commitMessage?: string;
};

export function getRegressions(items: Item[] = []) {
  const filteredItems = items?.filter?.(
    (item) => item.value === 0 || item.value > 0
  );
  if (!filteredItems.length) {
    return [];
  }

  // Go through items to check for significant value drops
  const regressions: Regression[] = [];
  filteredItems.forEach((item, index, all) => {
    const regression = index === 0 ? 0 : all[index - 1].value - item.value;
    if (regression >= REGRESSION_THRESHOLD) {
      // Check if the regression has already been recovered from - to add some buffer,
      // we allow for a recovery of 90% instead of insisting on full recovery to
      // original score, the slow regression over time will catch too many 90% recoveries
      const recovered = filteredItems.findIndex(
        (i, idx) =>
          i.value >= filteredItems[index - 1].value - regression * 0.1 &&
          idx > index
      );
      console.log({ recovered });
      if (recovered === -1) {
        regressions.push({
          type: "immediate",
          item,
          prevItem: all[index - 1],
          regression,
          commit: item.report?.commit,
          commitMessage: item.report?.commitMessage,
        });
      }
    }
  });

  // Potential over time regression
  if (!regressions.length) {
    const current = filteredItems[filteredItems.length - 1];
    const maxValue = Math.max(...filteredItems.map((item) => item.value));
    const max = filteredItems.find((item) => item.value === maxValue)!;
    if (max.value - current.value >= REGRESSION_THRESHOLD) {
      regressions.push({
        type: "trend",
        item: current,
        prevItem: max,
        regression: max.value - current.value,
        commit: current.report?.commit,
        commitMessage: current.report?.commitMessage,
      });
    }
  }

  return regressions;
}

type Obj = {
  [key: string]: Item[];
};

export function getRegressionsFromObject(obj: Obj) {
  return Object.keys(obj).reduce<(Regression & { groupKey: string })[]>(
    (all, key: any) => {
      const r = getRegressions(obj[key]);
      return all.concat(
        r.map((regression) => ({
          ...regression,
          groupKey: key,
        }))
      );
    },
    []
  );
}
