import { useMemo } from "react";
import styled from "styled-components";

import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { Heading, Small } from "src/components/text";
import { ReportCompareOverviewListItem } from "src/list-items/report/compare/overview";
import { AUDITS } from "src/utils/audits";

// TODO: make configurable
const audits = AUDITS.filter(
  (audit) => audit.category === "performance" && audit.default
);

const Content = styled.div`
  width: 100%;
  max-width: 60rem;
`;

export function PerformanceOverview({ baseData, compareData }: any) {
  const items = useMemo(() => {
    return audits.map((audit) => ({
      ...audit,
      base: baseData.report?.audits?.[audit.id],
      compare: compareData.report?.audits?.[audit.id],
    }));
  }, [baseData, compareData]);

  return (
    <>
      <Heading level={3}>Performance metrices</Heading>
      <Content>
        <Small grey>
          These are more granular performance specific metrices, showing
          specific timings that impact the users experience.
        </Small>
      </Content>

      <Spacer h=".8rem" />
      <List
        columns={2}
        gap=".6rem"
        items={items}
        Item={ReportCompareOverviewListItem}
      />
    </>
  );
}
