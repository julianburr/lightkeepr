const REGRESSION_THRESHOLD = 10;

type Item = {
  value: number;
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
      regressions.push({
        type: "immediate",
        item,
        prevItem: all[index - 1],
        regression,
        commit: item.report?.commit,
        commitMessage: item.report?.commitMessage,
      });
    }
  });

  // TODO: filter out regressions that are already recovered from

  // Potential over time regression
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

  return regressions;
}

type Obj = {
  [key: string]: Item[];
};

export function getRegressionsFromObject(obj: Obj) {
  return Object.keys(obj).reduce<(Regression & { groupKey: string })[]>(
    (all, key: any) => {
      const r = getRegressions(
        obj[key].map((val: any) => ({
          value: val.value,
          report: val.report,
        }))
      );
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
