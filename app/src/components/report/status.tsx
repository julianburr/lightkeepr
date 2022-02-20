import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { StatusAvatar } from "src/components/status-avatar";
import { GroupHeading, P } from "src/components/text";
import { CATEGORIES } from "src/utils/audits";

const db = getFirestore();

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.2rem;
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  padding: 0.3rem 0;

  p {
    margin: 0;
  }
`;

export function ReportStatus({ data }: any) {
  const approvedBy = useDocument(
    data?.approvedBy?.id ? doc(db, "users", data?.approvedBy?.id) : undefined
  );

  const statusMessage =
    data.status?.value === "passed"
      ? data.status?.reasons?.includes?.("manual")
        ? `manually approved by ${approvedBy?.name} (${approvedBy?.email})`
        : null
      : data.status?.reasons
          ?.map?.((reason: string) => {
            switch (reason) {
              case "target": {
                const categories = data.status?.failedTargets
                  ?.map?.(
                    (key: string) => CATEGORIES.find((c) => c.id === key)?.label
                  )
                  ?.join(",");
                return `some targets were not met (${categories})`;
              }

              case "budget":
                return `some lighthouse budgets were not met`;

              case "regression:main":
                return `there were regressions compared to the main branch`;

              case "regression:branch":
                return `there were regressions compared to this feature branch`;
            }
          })
          ?.join(", ");

  return (
    <Container>
      <StatusAvatar status={data.status} />
      <StatusText>
        <GroupHeading>Status</GroupHeading>
        <P>
          {data.status?.value === "failed"
            ? "Failed"
            : data?.status?.value === "passed"
            ? "Passed"
            : "n/a"}
          {statusMessage && <> — {statusMessage}</>}
        </P>
      </StatusText>
    </Container>
  );
}
