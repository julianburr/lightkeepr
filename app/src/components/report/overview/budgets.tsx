import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { GroupHeading } from "src/components/text";
import { BudgetListItem } from "src/list-items/budget";

type BudgetsOverviewProps = {
  report: any;
  pastReports: any[];
  data?: any;
};

export function BudgetsOverview({ data }: BudgetsOverviewProps) {
  const audits = data.report.audits;

  const performanceBudgets = audits?.["performance-budget"]?.details?.items;
  const timingBudgets = audits?.["timing-budget"]?.details?.items;

  return (
    <>
      {!!performanceBudgets?.length && (
        <>
          <Spacer h="2.4rem" />
          <GroupHeading>Performance budgets</GroupHeading>
          <Spacer h=".2rem" />
          <List columns={2} items={performanceBudgets} Item={BudgetListItem} />
        </>
      )}

      {!!timingBudgets?.length && (
        <>
          <Spacer h="2.4rem" />
          <GroupHeading>Timing budgets</GroupHeading>
          <Spacer h=".2rem" />
          <List columns={2} items={timingBudgets} Item={BudgetListItem} />
        </>
      )}
    </>
  );
}
