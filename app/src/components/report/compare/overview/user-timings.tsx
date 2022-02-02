import { useMemo } from "react";
import styled from "styled-components";

import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { Heading, P, Small } from "src/components/text";
import { ReportCompareOverviewListItem } from "src/list-items/report/compare/overview";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 60rem;
`;

type UserTimingsOverviewProps = {
  baseData: any;
  compareData: any;
};

export function UserTimingsOverview({
  baseData,
  compareData,
}: UserTimingsOverviewProps) {
  const items = useMemo(
    () =>
      compareData?.report?.audits?.["user-timings"]?.details?.items
        ?.filter?.((timing: any) => timing.timingType === "Measure")
        ?.map?.((timing: any) => ({
          label: timing.name,
          base: baseData?.report?.audits?.[
            "user-timings"
          ]?.details?.items?.find?.((item: any) => item.name === timing.name),
          compare: compareData?.report?.audits?.[
            "user-timings"
          ]?.details?.items?.find?.((item: any) => item.name === timing.name),
        })),
    [compareData]
  );

  return (
    <>
      <Heading level={3}>User timings</Heading>
      <Content>
        <Small grey>
          User timings are custom measurements you can put into your code to
          measure whatever is relevant for your website or application. These
          can be really useful to measure things that have big impact on your
          users experience.
        </Small>
      </Content>

      {!Object.keys(items).length ? (
        <P>No user timing measures found.</P>
      ) : (
        <>
          <Spacer h=".8rem" />
          <List
            columns={2}
            gap=".6rem"
            items={items}
            Item={ReportCompareOverviewListItem}
          />
        </>
      )}
    </>
  );
}
