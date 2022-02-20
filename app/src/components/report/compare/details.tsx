import { Fragment } from "react";
import { useMemo } from "react";

import { useSuspense } from "src/@packages/suspense";
import { List } from "src/components/list";
import { Markdown } from "src/components/markdown";
import { Spacer } from "src/components/spacer";
import { Heading, P } from "src/components/text";
import { useApi } from "src/hooks/use-api";
import { ReportCompareAuditListItem } from "src/list-items/report/compare/audit";

import { ReportCompareOverview } from "./overview";

type ReportCompareDetailsProps = {
  reportIds: string;
  categoryId?: string;
};

export function ReportCompareDetails({
  reportIds,
  categoryId,
}: ReportCompareDetailsProps) {
  const api = useApi();

  const [baseReportId, compareReportId] = reportIds.split("..");

  const { data: baseData } = useSuspense(
    () => api.get(`/api/reports/${baseReportId}`),
    { key: `report/${baseReportId}` }
  );

  const { data: compareData } = useSuspense(
    () => api.get(`/api/reports/${compareReportId}`),
    { key: `report/${compareReportId}` }
  );

  if (!categoryId) {
    return (
      <ReportCompareOverview baseData={baseData} compareData={compareData} />
    );
  }

  const { category, audits } = useMemo(() => {
    if (!categoryId) {
      return {};
    }

    const category = compareData.report.categories[categoryId];
    if (!category) {
      return {};
    }

    const audits: any[] = category.auditRefs.reduce((all: any[], ref: any) => {
      const baseAudit = baseData.report.audits[ref.id];
      const compareAudit = compareData.report.audits[ref.id];

      if (baseAudit.score !== compareAudit.score) {
        all.push({
          audit: compareAudit,
          report: compareData.report,
          baseAudit,
          baseReport: baseData.report,
        });
      }
      return all;
    }, []);

    return { category, audits };
  }, [baseData, compareData, categoryId]);

  if (!category) {
    return (
      <>
        <Heading level={2}>n/a</Heading>
        <P>
          This category has not been included in this report. This could happen
          because it has actively been excluded, or because the report type does
          generally not include it.
        </P>
      </>
    );
  }

  return (
    <Fragment key={category.id}>
      <Heading level={2}>{category.title}</Heading>
      {category.description && <Markdown>{category.description}</Markdown>}
      <Spacer h="1.8rem" />

      <List items={audits!} Item={ReportCompareAuditListItem} />
    </Fragment>
  );
}
