import classNames from "classnames";
import styled from "styled-components";

import TrendingDownSvg from "src/assets/icons/outline/trending-down.svg";
import TrendingUpSvg from "src/assets/icons/outline/trending-up.svg";

const ScoreItem = styled.div<{
  value: number;
  hasRun?: boolean;
  colorType?: "passed" | "warning" | "failed";
}>`
  width: 8rem;
  height: 8rem;
  border: 0 none;
  border-radius: var(--sol--border-radius-s);
  transition: background 0.2s;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  line-height: 1;
  background: var(--sol--palette-sand-100);

  &:hover,
  &:focus {
    background: var(--sol--palette-sand-200);
  }

  &.active:hover,
  &.active:focus,
  &.active {
    background: var(--sol--palette-sand-300);
  }

  &[data-result="passed"] {
    background: var(--sol--palette-green-50);

    &:hover,
    &:focus {
      background: var(--sol--palette-green-100);
    }

    &.active:hover,
    &.active:focus,
    &.active {
      background: var(--sol--palette-green-200);
    }
  }

  &[data-result="warning"] {
    background: var(--sol--palette-yellow-50);

    &:hover,
    &:focus {
      background: var(--sol--palette-yellow-100);
    }

    &.active:hover,
    &.active:focus,
    &.active {
      background: var(--sol--palette-yellow-200);
    }
  }

  &[data-result="failed"] {
    background: var(--sol--palette-red-50);

    &:hover,
    &:focus {
      background: var(--sol--palette-red-100);
    }

    &.active:hover,
    &.active:focus,
    &.active {
      background: var(--sol--palette-red-200);
    }
  }

  @media (min-width: 800px) {
    width: 11rem;
    height: 11rem;
    border: 0 none;
  }

  &:before,
  &:after,
  & span:before,
  & span:after {
    content: " ";
    position: absolute;
    border-width: 0.4rem;
    border-style: none;
    pointer-events: none;
    color: var(--sol--palette-sand-500);

    @media (min-width: 800px) {
      border-width: 0.6rem;
    }
  }

  &[data-result="passed"] {
    &:before,
    &:after,
    & span:before,
    & span:after {
      color: var(--sol--palette-green-500);
    }
  }

  &[data-result="warning"] {
    &:before,
    &:after,
    & span:before,
    & span:after {
      color: var(--sol--palette-yellow-500);
    }
  }

  &[data-result="failed"] {
    &:before,
    &:after,
    & span:before,
    & span:after {
      color: var(--sol--palette-red-500);
    }
  }

  &:before {
    top: 0;
    left: 50%;
    right: ${(props) => `${50 - (Math.min(props.value, 12.5) / 12.5) * 50}%;`};
    bottom: ${(props) =>
      `${(Math.min(Math.max(props.value - 12.5, 0), 12.5) / 12.5) * 50}%`};
    border-top-style: ${(props) => (props.value <= 0 ? "none" : "solid")};
    border-right-style: ${(props) => (props.value <= 12.5 ? "none" : "solid")};
    border-top-right-radius: ${(props) =>
      props.value <= 12.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  &:after {
    top: 50%;
    right: 0;
    bottom: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 25, 0), 12.5) / 12.5) * 50}%;`};
    left: auto;
    width: ${(props) =>
      `${(Math.min(Math.max(props.value - 37.5, 0), 12.5) / 12.5) * 50}%`};
    border-right-style: ${(props) => (props.value <= 25 ? "none" : "solid")};
    border-bottom-style: ${(props) => (props.value <= 37.5 ? "none" : "solid")};
    border-bottom-right-radius: ${(props) =>
      props.value <= 37.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  & span:before {
    bottom: 0;
    right: 50%;
    left: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 50, 0), 12.5) / 12.5) * 50}%;`};
    top: auto;
    height: ${(props) =>
      `${(Math.min(Math.max(props.value - 62.5, 0), 12.5) / 12.5) * 50}%`};
    border-bottom-style: ${(props) => (props.value <= 50 ? "none" : "solid")};
    border-left-style: ${(props) => (props.value <= 62.5 ? "none" : "solid")};
    border-bottom-left-radius: ${(props) =>
      props.value <= 62.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  & span:after {
    bottom: 50%;
    left: 0;
    top: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 75, 0), 12.5) / 12.5) * 50}%;`};
    right: auto;
    width: ${(props) =>
      `${(Math.min(Math.max(props.value - 87.5, 0), 12.5) / 12.5) * 50}%`};
    border-left-style: ${(props) => (props.value <= 75 ? "none" : "solid")};
    border-top-style: ${(props) => (props.value <= 87.5 ? "none" : "solid")};
    border-top-left-radius: ${(props) =>
      props.value <= 87.5 ? "0" : "var(--sol--border-radius-s)"};
  }
`;

const Value = styled.span`
  font-size: 2.4rem;
  margin-top: -0.2rem;

  @media (min-width: 800px) {
    margin-top: 0;
    font-size: 3.2rem;
  }
`;

const Diff = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.8rem 0 0;
  font-weight: 800;
  font-size: 1.4rem;

  @media (min-width: 800px) {
    font-size: 1.8rem;
  }

  svg {
    height: 1em;
    width: auto;
    margin: 0 0.3rem 0 0;
  }

  [data-result="passed"] & {
    color: var(--sol--palette-green-500);
  }

  [data-result="failed"] & {
    color: var(--sol--palette-red-500);
  }
`;

type ScoreValue = number | null | { passed: number; total: number };

type ScoreProps = {
  value?: ScoreValue;
  baseValue?: ScoreValue;
  active?: boolean;
};

export function Score({ value, baseValue, active }: ScoreProps) {
  // Check if the value is a snapshot object
  const isSnapshot =
    typeof value !== "number" && value !== null && value !== undefined;
  const isBaseSnapshot =
    typeof baseValue !== "number" &&
    baseValue !== null &&
    baseValue !== undefined;

  // Check if the value represents a valid report value, otherwise assume
  // the value shows that this category has not been run
  const hasRun = isSnapshot ? !!value.total : !!value || value === 0;
  const hasBaseRun = !!baseValue || baseValue === 0;

  // Get percentage based off value
  const pctValue = hasRun
    ? isSnapshot
      ? Math.round((value.passed / value.total) * 100)
      : Math.round((value as number) * 100)
    : 0;
  const basePctValue = hasBaseRun
    ? isBaseSnapshot
      ? Math.round((baseValue.passed / baseValue.total) * 100)
      : Math.round(baseValue * 100)
    : 0;

  // Get proper score and diff labels
  const label = hasRun
    ? isSnapshot
      ? `${value.passed}/${value.total}`
      : `${pctValue}`
    : "n/a";

  const diff =
    hasRun && hasBaseRun
      ? isSnapshot
        ? (value as any).passed - (baseValue as any).passed
        : pctValue - basePctValue
      : undefined;

  return (
    <ScoreItem
      hasRun={hasRun}
      value={pctValue}
      className={classNames({ active })}
      data-result={
        diff
          ? diff < 0
            ? "failed"
            : "passed"
          : hasRun
          ? (pctValue as number) < 50
            ? "failed"
            : (pctValue as number) < 90
            ? "warning"
            : "passed"
          : undefined
      }
    >
      <Value>{label}</Value>
      <Diff>
        {diff ? (
          diff > 0 ? (
            <>
              <TrendingUpSvg />
              <span>{diff}</span>
            </>
          ) : (
            <>
              <TrendingDownSvg />
              <span>{Math.abs(diff)}</span>
            </>
          )
        ) : null}
      </Diff>
    </ScoreItem>
  );
}
