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
  (audit) => audit.category === "network" && audit.default
);

type NetworkOverviewProps = {
  report: any;
  pastReports: any[];
  data?: any;
};

export function NetworkOverview({ pastReports, data }: NetworkOverviewProps) {
  const items = useMemo<{ [key: string]: any[] }>(
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
                audit,
                report,
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
        <h3>Network metrices</h3>
        <Small grey>
          These metrices show relevant information about network requests and
          network traffic. High amount of network requests how long network
          loading times can cause reduction in user experience.
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
