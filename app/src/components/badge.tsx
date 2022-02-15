import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.span`
  display: flex;
  width: 2rem;
  height: 2rem;
  position: relative;
`;

const Value = styled.span<{
  visible: boolean;
  intent: "danger" | "warning" | "primary" | "secondary" | "tertiary";
}>`
  position: absolute;
  inset: 0;
  background: ${(props) =>
    props.intent === "danger"
      ? `var(--sol--palette-red-500)`
      : props.intent === "warning"
      ? `var(--sol--palette-yellow-500)`
      : props.intent === "primary"
      ? `var(--sol--color-brand-500)`
      : props.intent === "tertiary"
      ? `var(--sol--color-black)`
      : `var(--sol--palette-sand-300)`};
  color: ${(props) =>
    props.intent === "secondary"
      ? `var(--sol--colo-black)`
      : `var(--sol--color-white)`};
  border-radius: 50%;
  font-size: 0.8rem;
  line-height: 1;
  border-radius: 0 none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) => (props.visible ? `scale(1)` : `scale(.8)`)};
  pointer-events: none;
  font-family: var(--sol--typography-family-default);
`;

type BadgeProps = {
  count?: number;
  intent?: "danger" | "warning" | "primary" | "secondary" | "tertiary";
};

export function Badge({ count, intent = "danger" }: BadgeProps) {
  // HACK: to avoid `0` showing during the transition out, we use a separate local
  // state to keep track of the visible count that only goes down to `1`
  const [value, setValue] = useState(count || 1);
  useEffect(() => {
    if (count) {
      setValue(count);
    }
  }, [count]);

  return (
    <Container>
      <Value visible={!!count} intent={intent}>
        {value}
      </Value>
    </Container>
  );
}
