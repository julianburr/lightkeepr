import styled from "styled-components";

import { useDialog } from "src/hooks/use-dialog";
import { ListItem } from "src/components/list";
import { Markdown } from "src/components/markdown";
import { P } from "src/components/text";

import { ReportAuditDialog } from "dialogs/report-audit";

import AlertSvg from "src/assets/icons/alert-circle.svg";
import CrossSvg from "src/assets/icons/x.svg";
import CheckSvg from "src/assets/icons/check.svg";
import InfoSvg from "src/assets/icons/info.svg";
import EyeSvg from "src/assets/icons/eye.svg";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  line-height: 1.1;
  gap: 0.6rem;
  text-align: left;
`;

const Status = styled.div<{ type: string }>`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: var(--sol--border-radius-s);
  background: ${(props) =>
    props.type === "improvement"
      ? "var(--sol--palette-red-500)"
      : props.type === "passed"
      ? "var(--sol--palette-green-500)"
      : "var(--sol--palette-sand-300)"};
  color: ${(props) =>
    ["improvement", "passed"].includes(props.type)
      ? "var(--sol--color-white)"
      : "var(--sol--palette-sand-700)"};
  margin: -0.2rem 0.8rem -0.2rem -0.3rem;
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;

  svg {
    height: 1em;
    width: auto;
  }
`;

export function ReportAuditListItem({ data }: any) {
  const reportAuditDialog = useDialog(ReportAuditDialog);
  return (
    <ListItem onClick={() => reportAuditDialog.open({ data })}>
      <Status type={data.type}>
        {data.type === "improvement" && <AlertSvg />}
        {data.type === "notApplicable" && <CrossSvg />}
        {data.type === "passed" && <CheckSvg />}
        {data.type === "manual" && <EyeSvg />}
        {data.type === "informative" && <InfoSvg />}
      </Status>
      <Container>
        <Markdown>{data.audit.title}</Markdown>

        {data.audit.displayValue && (
          <P grey>— {data.audit.displayValue.replace(/•/g, "—")}</P>
        )}
      </Container>
    </ListItem>
  );
}
