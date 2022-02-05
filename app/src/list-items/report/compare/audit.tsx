import styled from "styled-components";

import { ListItem } from "src/components/list";
import { Markdown } from "src/components/markdown";
import { Span, P } from "src/components/text";
import { ReportCompareAuditDialog } from "src/dialogs/report/compare/audit";
import { useDialog } from "src/hooks/use-dialog";

import TrendingDown from "src/assets/icons/outline/trending-down.svg";
import TrendingUp from "src/assets/icons/outline/trending-up.svg";

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

const Status = styled.div<{ score: number; baseScore: number }>`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: var(--sol--border-radius-s);
  background: ${(props) =>
    props.score < props.baseScore
      ? "var(--sol--palette-red-500)"
      : "var(--sol--palette-green-500)"};
  color: var(--sol--color-white);
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;

  svg {
    height: 1em;
    width: auto;
  }
`;

export function ReportCompareAuditListItem({ data }: any) {
  const reportCompareAuditDialog = useDialog(ReportCompareAuditDialog);
  return (
    <ListItem
      onClick={() =>
        reportCompareAuditDialog.open({
          data: data.audit,
          baseData: data.baseAudit,
        })
      }
    >
      <Container>
        <Status score={data.audit.score} baseScore={data.baseAudit.score}>
          {data.audit.score > data.baseAudit.score ? (
            <TrendingUp />
          ) : (
            <TrendingDown />
          )}
        </Status>
        <Content>
          <P>
            <Markdown>{data.audit?.title}</Markdown>

            {data.baseAudit?.displayValue && (
              <Span grey>
                {" "}
                —&nbsp;{data.audit.displayValue.replace(/•/g, "—")} (was{" "}
                {data.baseAudit.displayValue.replace(/•/g, "—")})
              </Span>
            )}
          </P>
        </Content>
      </Container>
    </ListItem>
  );
}
