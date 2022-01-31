import { useMemo } from "react";
import styled from "styled-components";

import { formatMs } from "src/utils/format";
import { getRegressionsFromObject } from "src/utils/regressions";
import { GroupHeading, P, Small } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Trend, Trends } from "src/components/trend";
import { List } from "src/components/list";

import { RegressionListItem } from "src/list-items/regression";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 60rem;
`;

type UserTimingsSummaryProps = {
  report: any;
  pastReports: any[];
  data?: any;
};

export function UserTimingsSummary({ pastReports }: UserTimingsSummaryProps) {
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
              all[timing.name].push(timing);
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
                label={name || "n/a"}
                items={items[name].map((item: any, _: number, all: any[]) => {
                  const max = Math.max(...all.map((i: any) => i.duration));
                  const value = item.duration / max;
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
