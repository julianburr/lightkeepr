import { useMemo } from "react";
import styled from "styled-components";

import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { Heading, Small } from "src/components/text";
import { ReportCompareOverviewListItem } from "src/list-items/report/compare/overview";
import { AUDITS } from "src/utils/audits";

// TODO: make configurable
const audits = AUDITS.filter(
  (audit) => audit.category === "network" && audit.default
);

const Content = styled.div`
  width: 100%;
  max-width: 60rem;
`;

export function NetworkOverview({ baseData, compareData }: any) {
  const items = useMemo(() => {
    return audits.map((audit) => ({
      ...audit,
      base: baseData.report?.audits?.[audit.id],
      compare: compareData.report?.audits?.[audit.id],
    }));
  }, [baseData, compareData]);

  return (
    <>
      <Heading level={3}>Network metrices</Heading>
      <Content>
        <Small grey>
          These metrices show relevant information about network requests and
          network traffic. High amount of network requests how long network
          loading times can cause reduction in user experience.
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
