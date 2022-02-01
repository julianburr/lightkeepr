import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";

import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { GroupHeading, P, Small } from "src/components/text";
import { Trend, Trends } from "src/components/trend";
import { RegressionListItem } from "src/list-items/regression";
import { AUDITS } from "src/utils/audits";
import { getRegressionsFromObject } from "src/utils/regressions";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 60rem;
`;

// TODO: make configurable
const audits = AUDITS.filter(
  (audit) => audit.category === "performance" && audit.default
);

type PerformanceSummaryProps = {
  report: any;
  pastReports: any[];
  data?: any;
};

export function PerformanceSummary({ pastReports }: PerformanceSummaryProps) {
  const items = useMemo(
    () =>
      pastReports
        ?.slice?.()
        ?.reverse?.()
        ?.reduce?.(
          (all: any, report: any) => {
            audits.forEach((audit: any) => {
              all[audit.id]?.push?.({
                value: report.audits?.[audit.id]?.score
                  ? report.audits[audit.id].score * 100
                  : report.audits?.[audit.id]?.score,
                displayValue: report.audits?.[audit.id]?.displayValue,
                date: report.createdAt
                  ? dayjs.unix(report.createdAt.seconds)
                  : null,
              });
            });
            return all;
          },
          audits.reduce<any>((all: any, audit: any) => {
            all[audit.id] = [];
            return all;
          }, {})
        ),
    [pastReports]
  );

  const regressions = useMemo(() => getRegressionsFromObject(items), [items]);

  return (
    <>
      <Content>
        <h3>Performance metrices</h3>
        <Small grey>
          These are more granular performance specific metrices, showing
          specific timings that impact the users experience.
        </Small>
      </Content>

      {regressions.length > 0 && (
        <P>
          There have been some potential regressions detected when comparing the
          past results of this report.
        </P>
      )}

      <Spacer h="1.2rem" />
      <Trends>
        {audits.map((audit) => (
          <Trend
            key={audit.id}
            label={audit.label || "n/a"}
            items={items[audit.id]}
          />
        ))}
      </Trends>

      {regressions.length > 0 && (
        <>
          <Spacer h="1.6rem" />
          <GroupHeading>Potential regressions</GroupHeading>
          <Spacer h=".2rem" />
          <List
            items={regressions.map((item) => ({
              ...item,
              title:
                audits.find((audit) => audit.id === item.groupKey)?.label ||
                item.groupKey,
            }))}
            Item={RegressionListItem}
          />
        </>
      )}
    </>
  );
}
