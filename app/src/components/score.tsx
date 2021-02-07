import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";

function getColor(props) {
  return props.success
    ? "green"
    : props?.warning
    ? "orange"
    : props.failure
    ? "red"
    : "#222";
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-self: flex-start;
  align-items: center;
`;

type ValueProps = {
  size: number;
  success?: boolean;
  warning?: boolean;
  failure?: boolean;
  disabled?: boolean;
};

const Value = styled.span<ValueProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.size / 3.5}px;
  font-family: monospace;
  color: ${getColor};
`;

type CircleProps = {
  strokeWidth?: number;
  success?: boolean;
  warning?: boolean;
  failure?: boolean;
  disabled?: boolean;
};

const BackgroundCircle = styled.circle<CircleProps>`
  fill: ${getColor};
  opacity: 0.1;
`;

const ValueCircle = styled.circle<CircleProps>`
  stroke: ${getColor};
  stroke-width: ${(props) => props.strokeWidth};
  stroke-linecap: round;
  fill: transparent;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: 0.35s stroke-dashoffset;
`;

type ScoreValue = number | null;

function Circle({
  score,
  size,
  strokeWidth,
  success = false,
  warning = false,
  failure = false,
  disabled = false,
}) {
  const circleRef = useRef<SVGCircleElement>(null);

  useLayoutEffect(() => {
    const circle = circleRef?.current;
    const radius = circle?.r?.baseVal?.value;

    const circumference = radius * 2 * Math.PI;
    const offset = circumference - score * circumference;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${offset}`;
  }, [circleRef, score]);

  return (
    <ValueCircle
      strokeWidth={strokeWidth}
      success={success}
      warning={warning}
      failure={failure}
      disabled={disabled}
      ref={circleRef}
      r={size / 2 - strokeWidth / 2}
      cx={size / 2}
      cy={size / 2}
    />
  );
}

type ScoreProps = {
  score?: ScoreValue;
  size?: number;
  strokeWidth?: number;
};

export function Score({ score, size = 40, strokeWidth = 3 }: ScoreProps) {
  const noScore = score === null || score === undefined;
  const props = {
    success: !noScore && score >= 0.9,
    warning: !noScore && score < 0.9 && score >= 0.5,
    failure: !noScore && score < 0.5,
  };
  return (
    <Container>
      <svg width={size} height={size}>
        <BackgroundCircle
          strokeWidth={strokeWidth}
          r={size / 2 - strokeWidth / 2}
          cx={size / 2}
          cy={size / 2}
          {...props}
        />
        <Circle
          size={size}
          strokeWidth={strokeWidth}
          score={score || 0}
          {...props}
        />
      </svg>
      <Value size={size} {...props}>
        {noScore ? "-" : score * 100}
      </Value>
    </Container>
  );
}

export function ScoreDiff({ score, oldScore, size = 40, strokeWidth = 3 }) {
  const noScore = score === null || score === undefined;

  const isRegression = !noScore && oldScore && score < oldScore;
  const isImprovement = !noScore && oldScore && score > oldScore;

  return (
    <Container>
      <svg width={size} height={size}>
        <BackgroundCircle
          strokeWidth={strokeWidth}
          success={isImprovement}
          failure={isRegression}
          r={size / 2 - strokeWidth / 2}
          cx={size / 2}
          cy={size / 2}
        />
        <Circle
          size={size}
          strokeWidth={strokeWidth}
          score={score}
          success={isImprovement}
          failure={isRegression}
        />
      </svg>
      <Value size={size} success={isImprovement} failure={isRegression}>
        {noScore ? "-" : score * 100}
      </Value>
    </Container>
  );
}
