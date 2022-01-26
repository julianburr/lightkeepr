import { Fragment } from "react";
import { useRouter } from "next/router";
import Markdown from "react-markdown";

import { useSuspense } from "src/@packages/suspense";
import { api } from "src/utils/api-client";
import { List } from "src/components/list";
import { Heading, P } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Accordion } from "src/components/accordion";

import { ReportAuditListItem } from "src/list-items/report-audit";

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
    return <P>Smart report not yet implemented</P>;
  }

  const category = data.report.categories[router.query.category];

  const groups: GroupedAudits = category.auditRefs.reduce(
    (all: GroupedAudits, ref: any) => {
      const audit = data.report.audits[ref.id];
      if (audit.scoreDisplayMode === "manual") {
        all.manual.push({ audit, ref, type: "manual" });
      } else if (audit.scoreDisplayMode === "notApplicable") {
        all.notApplicable.push({ audit, ref, type: "notApplicable" });
      } else if (audit.scoreDisplayMode === "informative") {
        all.informative.push({ audit, ref, type: "informative" });
      } else if (audit.score >= 0.9) {
        all.passed.push({ audit, ref, type: "passed" });
      } else {
        const groupKey = ref.group || "__";
        if (!all.others[groupKey]) {
          all.others[groupKey] = [];
        }
        all.others[groupKey].push({ audit, ref, type: "improvement" });
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

  return (
    <Fragment key={category.id}>
      <Heading level={2}>{category.title}</Heading>
      {category.description && <Markdown>{category.description}</Markdown>}
      <Spacer h="1.8rem" />

      {Object.keys(groups.others).map(
        (groupKey) =>
          groups.others[groupKey]?.length > 0 && (
            <>
              {data.report.categoryGroups[groupKey]?.title && (
                <Heading level={3}>
                  {data.report.categoryGroups[groupKey].title}
                </Heading>
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
            </>
          )
      )}

      {groups.manual?.length > 0 && (
        <>
          <Heading level={3}>Manual</Heading>
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
