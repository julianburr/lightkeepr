import "src/utils/firebase";

import dayjs from "dayjs";
import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

import { useDocument } from "src/@packages/firebase";
import { Menu } from "src/components/menu";
import { Meta } from "src/components/meta";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";

import ArrowLeftSvg from "src/assets/icons/outline/arrow-left.svg";

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
          value:
            report.meta.configSettings.formFactor === "mobile"
              ? "Mobile"
              : "Desktop",
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
  const { category, ...query } = router.query;

  const report = useDocument(doc(db, "reports", reportId));

  const items = [
    {
      icon: <ArrowLeftSvg />,
      label: "Back to run overview",
      isBacklink: true,
      ...(getLinkProps?.({ runId: report.run.id }) || {}),
    },

    // Report tabs
    {
      label: "Report",
      items: [
        {
          label: "Overview",
          href: { query },
          active: !category,
        },
        {
          label: "Performance",
          href: { query: { ...query, category: "performance" } },
          active: category === "performance",
        },
        {
          label: "Accessibility",
          href: { query: { ...query, category: "accessibility" } },
          active: category === "accessibility",
        },
        {
          label: "Best practices",
          href: { query: { ...query, category: "best-practices" } },
          active: category === "best-practices",
        },
        {
          label: "SEO",
          href: { query: { ...query, category: "seo" } },
          active: category === "seo",
        },
        {
          label: "PWA",
          href: { query: { ...query, category: "pwa" } },
          active: category === "pwa",
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
