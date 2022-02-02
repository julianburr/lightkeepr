import { Spacer } from "src/components/spacer";
import { Heading } from "src/components/text";

import { NetworkOverview } from "./network";
import { PerformanceOverview } from "./performance";
import { UserTimingsOverview } from "./user-timings";

export function ReportCompareOverview({ baseData, compareData }: any) {
  return (
    <>
      <Heading level={2}>Overview</Heading>

      <Spacer h="3.2rem" />
      <PerformanceOverview baseData={baseData} compareData={compareData} />

      <Spacer h="3.2rem" />
      <NetworkOverview baseData={baseData} compareData={compareData} />

      <Spacer h="3.2rem" />
      <UserTimingsOverview baseData={baseData} compareData={compareData} />
    </>
  );
}
