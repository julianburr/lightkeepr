import { useMemo } from "react";

import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { GroupHeading, P } from "src/components/text";
import { OpportunityListItem } from "src/list-items/opportunity";

type OpportunitiesOverviewProps = {
  report: any;
  pastReports: any[];
  reportData: any;
};

export function OpportunitiesOverview({
  reportData,
}: OpportunitiesOverviewProps) {
  // Performance
  const performance = useMemo(
    () =>
      Object.values(reportData?.audits)
        ?.filter?.(
          (audit: any) =>
            audit.details?.overallSavingsMs &&
            audit.details.overallSavingsMs > 0
        )
        .map((audit: any) => ({ ...audit, type: "performance" })),
    [reportData]
  );

  const totalSavingsMs = useMemo(() => {
    const total = performance.reduce<number>((all, audit: any) => {
      all += audit.details.overallSavingsMs;
      return all;
    }, 0);
    return total > 1000
      ? `${Math.ceil((total * 100) / 1000) / 100} s`
      : `${Math.ceil(total * 100) / 100} ms`;
  }, [performance]);

  // Network
  const network = useMemo(
    () =>
      Object.values(reportData?.audits)
        ?.filter?.(
          (audit: any) =>
            audit.details?.overallSavingsBytes &&
            audit.details.overallSavingsBytes > 0
        )
        .map((audit: any) => ({ ...audit, type: "network" })),
    [reportData]
  );

  const totalSavingsBytes = useMemo(() => {
    const total = network.reduce<number>((all, audit: any) => {
      all += audit.details.overallSavingsBytes;
      return all;
    }, 0);
    return total > 1024 * 1024
      ? `${Math.ceil((total * 100) / 1024 / 1024) / 100} MiB`
      : total > 1024
      ? `${Math.ceil((total * 100) / 1024) / 100} KiB`
      : `${Math.ceil(total * 100) / 100} B`;
  }, [network]);

  return (
    <>
      {performance.length > 0 && (
        <>
          <Spacer h="2.4rem" />
          <GroupHeading>
            Performance — Potential total savings of {totalSavingsMs}
          </GroupHeading>
          <Spacer h=".2rem" />
          <List items={performance} Item={OpportunityListItem} />
        </>
      )}

      {network.length > 0 && (
        <>
          <Spacer h="2.4rem" />
          <GroupHeading>
            Network — Potential total savings of {totalSavingsBytes}
          </GroupHeading>
          <Spacer h=".2rem" />
          <List items={network} Item={OpportunityListItem} />
        </>
      )}

      {!network.length && !performance.length && (
        <P>
          No opportunities to save significant loading times or network traffic
          found.
        </P>
      )}
    </>
  );
}
