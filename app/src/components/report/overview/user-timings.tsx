import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";

import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { GroupHeading, P, Small } from "src/components/text";
import { Trend, Trends } from "src/components/trend";
import { RegressionListItem } from "src/list-items/regression";
import { formatMs } from "src/utils/format";
import { getRegressionsFromObject } from "src/utils/regressions";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 60rem;
`;

type UserTimingsOverviewProps = {
  report: any;
  pastReports: any[];
  data?: any;
};

export function UserTimingsOverview({ pastReports }: UserTimingsOverviewProps) {
  const items = useMemo(
    () =>
      pastReports
        ?.slice?.()
        ?.reverse?.()
        ?.reduce?.((all: any, report: any) => {
          report?.audits?.["user-timings"]?.details?.items
            ?.filter?.((timing: any) => timing.timingType === "Measure")
            ?.forEach?.((timing: any) => {
              if (!all[timing.name]) {
                all[timing.name] = [];
              }
              all[timing.name].push({
                ...timing,
                date: report.createdAt
                  ? dayjs.unix(report.createdAt.seconds)
                  : undefined,
                report,
              });
            });
          return all;
        }, {}),
    [pastReports]
  );

  const regressions = useMemo(() => getRegressionsFromObject(items), [items]);

  return (
    <>
      <Content>
        <h3>User timings</h3>
        <Small grey>
          User timings are custom measurements you can put into your code to
          measure whatever is relevant for your website or application. These
          can be really useful to measure things that have big impact on your
          users experience.
        </Small>
      </Content>

      {!Object.keys(items).length ? (
        <P>No user timing measures found.</P>
      ) : regressions.length ? (
        <P>
          There have been some potential regressions detected when comparing the
          past results of this report.
        </P>
      ) : null}

      {!!Object.keys(items).length && (
        <>
          <Spacer h="1.2rem" />
          <Trends>
            {Object.keys(items).map((name) => (
              <Trend
                key={name}
                label={name}
                items={items[name].map((item: any, _: number, all: any[]) => {
                  const fastest = Math.min(...all.map((i: any) => i.duration));
                  const value = (fastest / item.duration) * 100;
                  return {
                    ...item,
                    value,
                    displayValue: formatMs(item.duration),
                  };
                })}
              />
            ))}
          </Trends>

          {regressions.length > 0 && (
            <>
              <Spacer h="1.6rem" />
              <GroupHeading>Potential regressions</GroupHeading>
              <Spacer h=".2rem" />
              <List items={regressions} Item={RegressionListItem} />
            </>
          )}
        </>
      )}
    </>
  );
}
