import "src/utils/firebase";

import { useRouter } from "next/router";
import { doc, getFirestore } from "firebase/firestore";

import { useDocument } from "src/@packages/firebase";
import { useSuspense } from "src/@packages/suspense";
import { api } from "src/utils/api-client";
import { Menu } from "src/components/menu";
import { Spacer } from "src/components/spacer";
import { Meta } from "src/components/meta";
import { Suspense } from "src/components/suspense";

import ArrowLeftSvg from "src/assets/icons/arrow-left.svg";
import dayjs from "dayjs";

const db = getFirestore();

type ReportSidebarProps = {
  reportId: string;
  getLinkProps?: (state: any) => any;
};

function ReportMeta({ reportId }: ReportSidebarProps) {
  const report = useDocument(doc(db, "reports", reportId));

  return (
    <Meta
      data={[
        {
          label: "Generated at",
          value: report.createdAt
            ? dayjs.unix(report.createdAt.seconds).format("D MMM YYYY h:mma")
            : null,
        },
        {
          label: "Lighthouse version",
          value: report.meta.lighthouseVersion,
        },
        {
          label: "Device",
          value: report.meta.configSettings.formFactor,
        },
        {
          label: "Screen emulation",
          value: (
            <>
              {report.meta.configSettings.screenEmulation.width}&times;
              {report.meta.configSettings.screenEmulation.height}
            </>
          ),
        },
        {
          label: "Throttling (request latency)",
          value: `${
            Math.ceil(
              report.meta.configSettings.throttling.requestLatencyMs * 100
            ) / 100
          } kb/s`,
        },
        {
          label: "Throttling (downloads)",
          value: `${
            Math.ceil(
              report.meta.configSettings.throttling.downloadThroughputKbps * 100
            ) / 100
          } kb/s`,
        },
        {
          label: "Throttling (uploads)",
          value: `${
            Math.ceil(
              report.meta.configSettings.throttling.uploadThroughputKbps * 100
            ) / 100
          } kb/s`,
        },
        {
          label: "Throttling (CPU)",
          value: (
            <>
              {report.meta.configSettings.throttling.cpuSlowdownMultiplier}
              &times;
            </>
          ),
        },
      ]}
    />
  );
}

export function ReportSidebar({ reportId, getLinkProps }: ReportSidebarProps) {
  const router = useRouter();

  const report = useDocument(doc(db, "reports", reportId));

  const items = [
    {
      icon: <ArrowLeftSvg />,
      label: "Back to project overview",
      href: `/app/${router.query.teamId}/runs/${report.run.id}`,
      isBacklink: true,
      ...(getLinkProps?.({ runId: report.run.id }) || {}),
    },

    // Report tabs
    {
      label: "Report",
      items: [
        {
          label: "Overview",
          href: `/app/${router.query.teamId}/reports/${reportId}`,
        },
        {
          label: "Performance",
          href: `/app/${router.query.teamId}/reports/${reportId}?category=performance`,
        },
        {
          label: "Accessibility",
          href: `/app/${router.query.teamId}/reports/${reportId}?category=accessibility`,
        },
        {
          label: "Best practices",
          href: `/app/${router.query.teamId}/reports/${reportId}?category=best-practices`,
        },
        {
          label: "SEO",
          href: `/app/${router.query.teamId}/reports/${reportId}?category=seo`,
        },
        {
          label: "PWA",
          href: `/app/${router.query.teamId}/reports/${reportId}?category=pwa`,
        },
      ],
    },
  ];

  return (
    <>
      <Menu items={items} />

      <Spacer h="2.4rem" />
      <Suspense fallback={null}>
        <ReportMeta reportId={reportId} />
      </Suspense>
    </>
  );
}
