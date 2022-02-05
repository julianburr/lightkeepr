import { useCallback } from "react";
import styled from "styled-components";

import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";
import { formatBytes, formatMs } from "src/utils/format";

import TrendingDown from "src/assets/icons/outline/trending-down.svg";
import TrendingUp from "src/assets/icons/outline/trending-up.svg";

const Container = styled.div`
  margin: -0.4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Value = styled.div`
  padding: 1.2rem;
  width: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--sol--border-radius-s);
  background: var(--sol--palette-sand-400);
  color: var(--sol--color-black);
  font-family: "Playfair Display";

  &[data-result="passed"] {
    background: var(--sol--palette-green-500);
    color: var(--sol--color-white);
  }

  &[data-result="failed"] {
    background: var(--sol--palette-red-500);
    color: var(--sol--color-white);
  }
`;

const Diff = styled(Small)`
  display: flex;
  flex-direction: row;
  align-items: center;

  svg {
    height: 1em;
    width: auto;
    margin: 0 0.3rem 0 0;
  }
`;

export function ReportCompareOverviewListItem({ data }: any) {
  const diff = data.compare?.score - data.base?.score;

  const diffUnit = data.compare.numericUnit;
  const diffValue = diffUnit
    ? data.compare?.numericValue - data.base?.numericValue
    : diff * 100;

  const renderValue = useCallback((numericUnit, value) => {
    return numericUnit === "millisecond"
      ? formatMs(value)
      : numericUnit === "byte"
      ? formatBytes(value)
      : value;
  }, []);

  return (
    <ListItem>
      <Container>
        <Value
          data-result={diff > 0 ? "passed" : diff < 0 ? "failed" : undefined}
        >
          <span>{renderValue(diffUnit, diffValue)}</span>
        </Value>
        <Content>
          <P>{data.label}</P>
          <Diff grey>
            {diff === 0 ? (
              "—"
            ) : (
              <>
                {diff > 0 ? <TrendingUp /> : <TrendingDown />}
                <span>{renderValue(diffUnit, diffValue)}</span>
              </>
            )}
          </Diff>
        </Content>
      </Container>
    </ListItem>
  );
}
