import { Fragment } from "react";
import { useRouter } from "next/router";

import { useSuspense } from "src/@packages/suspense";
import { api } from "src/utils/api-client";
import { List } from "src/components/list";
import { Heading, P } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Accordion } from "src/components/accordion";
import { Markdown } from "src/components/markdown";
import { ReportSummary } from "src/components/report-summary";

import { ReportAuditListItem } from "src/list-items/report-audit";
import { useMemo } from "react";

type Audit = any;

type GroupedAudits = {
  others: { [key: string]: Audit[] };
  manual: Audit[];
  notApplicable: Audit[];
  informative: Audit[];
  passed: Audit[];
};

export function ReportDetails() {
  const router = useRouter();

  const { data } = useSuspense(
    () => api.get(`/api/reports/${router.query.reportId}`),
    { key: `report/${router.query.reportId}` }
  );

  if (!router.query.category) {
    return <ReportSummary reportId={router.query.reportId!} />;
  }

  const { category, groups } = useMemo(() => {
    if (!router.query.category) {
      return {};
    }

    const category = data.report.categories[router.query.category];
    if (!category) {
      return {};
    }

    const groups: GroupedAudits = category.auditRefs.reduce(
      (all: GroupedAudits, ref: any) => {
        const audit = data.report.audits[ref.id];
        if (ref.group === "hidden") {
          return all;
        } else if (audit.scoreDisplayMode === "manual") {
          all.manual.push({
            audit,
            ref,
            type: "manual",
            report: data.report,
          });
        } else if (audit.scoreDisplayMode === "notApplicable") {
          all.notApplicable.push({
            audit,
            ref,
            type: "notApplicable",
            report: data.report,
          });
        } else if (audit.scoreDisplayMode === "informative") {
          all.informative.push({
            audit,
            ref,
            type: "informative",
            report: data.report,
          });
        } else if (audit.score >= 0.9) {
          all.passed.push({
            audit,
            ref,
            type: "passed",
            report: data.report,
          });
        } else {
          const groupKey = ref.group || "__";
          if (!all.others[groupKey]) {
            all.others[groupKey] = [];
          }
          all.others[groupKey].push({
            audit,
            ref,
            type: "improvement",
            report: data.report,
          });
        }
        return all;
      },
      {
        manual: [],
        notApplicable: [],
        informative: [],
        passed: [],
        others: { __: [] },
      }
    );

    return { category, groups };
  }, [data, router.query.category]);

  if (!groups || !category) {
    return (
      <>
        <Heading level={2}>n/a</Heading>
        <P>This category has been excluded from the report.</P>
      </>
    );
  }

  return (
    <Fragment key={category.id}>
      <Heading level={2}>{category.title}</Heading>
      {category.description && <Markdown>{category.description}</Markdown>}
      <Spacer h="1.8rem" />

      {Object.keys(groups.others).map(
        (groupKey) =>
          groups.others[groupKey]?.length > 0 && (
            <Fragment key={groupKey}>
              {data.report.categoryGroups[groupKey]?.title && (
                <>
                  <Heading level={3}>
                    {data.report.categoryGroups[groupKey].title}
                  </Heading>
                  <Spacer h=".2rem" />
                </>
              )}
              {data.report.categoryGroups[groupKey]?.description && (
                <Markdown>
                  {data.report.categoryGroups[groupKey].description}
                </Markdown>
              )}
              <List
                items={groups.others[groupKey]}
                Item={ReportAuditListItem}
              />
              <Spacer h="1.8rem" />
            </Fragment>
          )
      )}

      {groups.manual?.length > 0 && (
        <>
          <Heading level={3}>Manual</Heading>
          <Spacer h=".2rem" />
          {category.manualDescription && (
            <Markdown>{category.manualDescription}</Markdown>
          )}
          <List items={groups.manual} Item={ReportAuditListItem} />
          <Spacer h="1.8rem" />
        </>
      )}

      {groups.informative?.length > 0 && (
        <>
          <Accordion title={`Informative (${groups.informative?.length})`}>
            <List items={groups.informative} Item={ReportAuditListItem} />
          </Accordion>
          <Spacer h="1.8rem" />
        </>
      )}

      {groups.notApplicable?.length > 0 && (
        <>
          <Accordion title={`Not Applicable (${groups.notApplicable?.length})`}>
            <List items={groups.notApplicable} Item={ReportAuditListItem} />
          </Accordion>
          <Spacer h="1.8rem" />
        </>
      )}

      {groups.passed?.length > 0 && (
        <>
          <Accordion title={`Passed (${groups.passed?.length})`}>
            <List items={groups.passed} Item={ReportAuditListItem} />
          </Accordion>
          <Spacer h="1.8rem" />
        </>
      )}
    </Fragment>
  );
}
