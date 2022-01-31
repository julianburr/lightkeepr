import styled from "styled-components";

import { ListItem } from "src/components/list";
import { Grey, P } from "src/components/text";

import AlertSvg from "src/assets/icons/alert-circle.svg";
import CheckSvg from "src/assets/icons/check.svg";
import { formatBytes, formatMs } from "src/utils/format";

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

const Status = styled.div<{ failed: boolean }>`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: var(--sol--border-radius-s);
  background: ${(props) =>
    props.failed
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

export function BudgetListItem({ data }: any) {
  const failed =
    !!data.sizeOverBudget || !!data.countOverBudget || !!data.sizeOverBudget;
  return (
    <ListItem>
      <Container>
        <Status failed={failed}>
          {failed && <AlertSvg />}
          {!failed && <CheckSvg />}
        </Status>
        <Content>
          <P>
            <P>
              {data.label} {data.requestCount && `(${data.requestCount})`}
            </P>

            {data.transferSize && (
              <Grey>
                {" "}
                —&nbsp;{formatBytes(data.transferSize)}{" "}
                {data.sizeOverBudget
                  ? `(+${formatBytes(data.sizeOverBudget)})`
                  : data.countOverBudget
                  ? `(+${data.countOverBudget})`
                  : null}
              </Grey>
            )}

            {data.measurement && (
              <Grey>
                {" "}
                —&nbsp;{formatMs(data.measurement)}{" "}
                {data.overBudget && `(+ ${formatMs(data.overBudget)})`}
              </Grey>
            )}
          </P>
        </Content>
      </Container>
    </ListItem>
  );
}
