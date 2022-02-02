import styled from "styled-components";

import { ListItem } from "src/components/list";
import { Markdown } from "src/components/markdown";
import { Span, P } from "src/components/text";
import { ReportAuditDialog } from "src/dialogs/report/audit";
import { useDialog } from "src/hooks/use-dialog";
import { formatBytes, formatMs } from "src/utils/format";

import AlertSvg from "src/assets/icons/alert-circle.svg";

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

const Status = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: var(--sol--border-radius-s);
  background: var(--sol--palette-sand-300);
  color: var(--sol--palette-sand-700);
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;

  svg {
    height: 1em;
    width: auto;
  }
`;

export function OpportunityListItem({ data }: any) {
  const reportAuditDialog = useDialog(ReportAuditDialog);
  return (
    <ListItem onClick={() => reportAuditDialog.open({ data })}>
      <Container>
        <Status>
          <AlertSvg />
        </Status>
        <Content>
          <P>
            <Markdown>{data.title}</Markdown>

            {data.type === "performance" && data.details?.overallSavingsMs && (
              <Span grey>
                {" "}
                —&nbsp;Potential savings of{" "}
                {formatMs(data.details?.overallSavingsMs)}
              </Span>
            )}

            {data.type === "network" && data.details?.overallSavingsBytes && (
              <Span grey>
                {" "}
                —&nbsp;Potential savings of{" "}
                {formatBytes(data.details?.overallSavingsBytes)}
              </Span>
            )}
          </P>
        </Content>
      </Container>
    </ListItem>
  );
}
