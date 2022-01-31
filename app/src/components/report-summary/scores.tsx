import { useMemo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import styled from "styled-components";

import { getRegressionsFromObject } from "src/utils/regressions";
import { CATEGORIES } from "src/utils/audits";
import { GroupHeading, P, Small } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Trend, Trends } from "src/components/trend";
import { List } from "src/components/list";
import { Hint } from "src/components/hint";

import { RegressionListItem } from "src/list-items/regression";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 60rem;
`;

type ScoresSummaryProps = {
  report: any;
  pastReports: any[];
  data?: any;
};

export function ScoresSummary({ pastReports }: ScoresSummaryProps) {
  const items = useMemo(
    () =>
      pastReports
        ?.slice?.()
        ?.reverse?.()
        ?.reduce?.<{ [key: string]: any[] }>(
          (all, report: any) => {
            CATEGORIES.map((category) => category.id).forEach((key) => {
              all[key]?.push?.({
                value: report.summary[key]
                  ? report.summary[key] * 100
                  : report.summary[key],
                date: report.createdAt
                  ? dayjs.unix(report.createdAt.seconds)
                  : null,
                report,
              });
            });
            return all;
          },
          CATEGORIES.reduce<{ [key: string]: any[] }>((all, category) => {
            all[category.id] = [];
            return all;
          }, {})
        ),
    [pastReports]
  );

  const regressions = useMemo(() => getRegressionsFromObject(items), [items]);
  console.log({ regressions });

  return (
    <>
      <Content>
        <h3>Primary scores</h3>
        <Small grey>
          This summary shows the trends in the primary lighthouse scores as
          shown below. This can be useful to detect any recent regressions and
          link them back to specific commits that caused them.
        </Small>
      </Content>

      {!pastReports?.length || pastReports.length === 1 ? (
        <P>
          No past reports found. This could be because of the limited retention
          on the free plan. You can upgrade to the premium plan to increase the
          retention amount,{" "}
          <Link href="/docs/premium-features/retention">
            <a>learn more</a>
          </Link>{" "}
          in our documentation.
        </P>
      ) : regressions.length ? (
        <>
          <P>
            {pastReports.length - 1} past result
            {pastReports.length !== 2 && "s"} found for the same report. There
            were some potential regressions found.
          </P>
        </>
      ) : (
        <P>
          {pastReports.length - 1} past result{pastReports.length !== 2 && "s"}{" "}
          found for the same report. There were no significant regressions
          detected in those.
        </P>
      )}

      <Spacer h="1.2rem" />
      <Trends>
        {CATEGORIES.map((category) => (
          <Trend
            key={category.id}
            label={category.label}
            items={items[category.id]}
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
                CATEGORIES.find((category) => category.id === item.groupKey)
                  ?.label || item.groupKey,
            }))}
            Item={RegressionListItem}
          />

          {regressions.find(
            (regression) =>
              !regression.item?.report?.commit ||
              !regression.prevItem?.report?.commit
          ) && (
            <>
              <Spacer h="1.6rem" />
              <Hint>
                We notices some of the reports don't have a commit associated
                with them. If you add commit hashes to your reports, we can link
                your regressions right to the commit that likely caused them.{" "}
                <a href="/docs/" target="_blank" rel="noreferrer noopener">
                  Learn more
                </a>{" "}
                on how to do that.
              </Hint>
            </>
          )}
        </>
      )}
    </>
  );
}
