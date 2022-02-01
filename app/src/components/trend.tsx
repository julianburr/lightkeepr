import { Dayjs } from "dayjs";
import { Ref, useMemo, useEffect, useRef, useState, ReactNode } from "react";
import styled from "styled-components";

import { Tooltip } from "src/components/tooltip";

import { GroupHeading } from "./text";

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;

  h3 {
    margin: 0 0 0.2rem;
  }
`;

const Graph = styled.div`
  width: 100%;
  height: 3.2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.2rem;
  overflow: hidden;
`;

const Bar = styled.div<{ value: TrendItem["value"] }>`
  height: 3.2rem;
  width: 0.8rem;
  border-radius: 0.3rem;
  background: var(--sol--palette-sand-100);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &:before {
    content: " ";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 0.2rem;
    height: ${(props) => `${props.value || 0}%`};
    background: ${(props) =>
      !props.value && props.value !== 0
        ? "transparent"
        : props.value < 50
        ? "var(--sol--palette-red-500)"
        : props.value < 90
        ? "var(--sol--palette-yellow-500)"
        : "var(--sol--palette-green-500)"};
  }
`;

export const Trends = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  width: 100%;

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (min-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
`;

type TrendItem = {
  date?: Dayjs;
  value?: number | null;
  displayValue?: ReactNode;
};

type TrendGraphProps = {
  items: TrendItem[];
};

function TrendGraph({ items }: TrendGraphProps) {
  const containerRef = useRef<HTMLDivElement>();
  const [fits, setFits] = useState(0);

  useEffect(() => {
    function calcFits() {
      if (!containerRef.current) {
        return;
      }
      return setFits(Math.floor((containerRef.current!.clientWidth + 3) / 10));
    }

    calcFits();

    window.addEventListener("resize", calcFits);
    return () => window.removeEventListener("resize", calcFits);
  }, []);

  const bars = useMemo<TrendItem[]>(
    () =>
      Array.from(new Array(Math.max(fits - items.length, 0)))
        .concat(items)
        .splice(fits * -1),
    [fits]
  );

  return (
    <Graph ref={containerRef as Ref<HTMLDivElement>}>
      {bars.map((bar, index) =>
        bar?.date ? (
          <Tooltip
            key={bar.date.format()}
            content={`${bar.date.format("D MMM YYYY h:mma")} — ${
              (bar.displayValue || bar.value) ?? "n/a"
            }`}
          >
            {(props) => <Bar {...props} value={bar?.value} />}
          </Tooltip>
        ) : (
          <Bar key={index} value={bar?.value} />
        )
      )}
    </Graph>
  );
}

type TrendProps = {
  label?: ReactNode;
  items?: TrendItem[];
};

export function Trend({ items = [], label }: TrendProps) {
  return (
    <Container>
      <GroupHeading>{label}</GroupHeading>
      <TrendGraph items={items} />
    </Container>
  );
}
