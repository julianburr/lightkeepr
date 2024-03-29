import styled from "styled-components";

import { ListItem } from "src/components/list";
import { Markdown } from "src/components/markdown";
import { Span, P } from "src/components/text";
import { ReportAuditDialog } from "src/dialogs/report/audit";
import { useDialog } from "src/hooks/use-dialog";

import CheckSvg from "src/assets/icons/outline/check.svg";
import AlertSvg from "src/assets/icons/outline/exclamation-circle.svg";
import EyeSvg from "src/assets/icons/outline/eye.svg";
import InfoSvg from "src/assets/icons/outline/information-circle.svg";
import CrossSvg from "src/assets/icons/outline/x.svg";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.8rem;
  margin: -0.3rem;
  width: calc(100% + 0.6rem);
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  line-height: 1.2;
  gap: 0.6rem;
  text-align: left;
  padding: 0.6rem 0 0.5rem;

  p p {
    display: inline;
  }
`;

const Status = styled.div<{ type: string }>`
  width: 2.8rem;
  height: 2.8rem;
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
    <ListItem onClick={() => reportAuditDialog.open({ data: data.audit })}>
      <Container>
        <Status type={data.type}>
          {data.type === "improvement" && <AlertSvg />}
          {data.type === "notApplicable" && <CrossSvg />}
          {data.type === "passed" && <CheckSvg />}
          {data.type === "manual" && <EyeSvg />}
          {data.type === "informative" && <InfoSvg />}
        </Status>
        <Content>
          <P>
            <Markdown>{data.audit?.title}</Markdown>

            {data.audit?.displayValue && (
              <Span grey>
                {" "}
                —&nbsp;{data.audit.displayValue.replace(/•/g, "—")}
              </Span>
            )}
          </P>
        </Content>
      </Container>
    </ListItem>
  );
}
