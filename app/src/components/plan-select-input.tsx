import classNames from "classnames";
import styled from "styled-components";

import { P } from "src/components/text";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1.8rem;
  transition: background 0.2s, border 0.2s;
  background: transparent;
  border: 0.1rem solid var(--sol--input-border-color-default);
  border-radius: var(--sol--border-radius-s);
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;

  &:hover,
  &:focus {
    border-color: var(--sol--input-border-color-hover-default);
  }

  &.selected {
    &,
    &:hover,
    &:focus {
      border-color: var(--sol--color-black);
    }
  }

  p {
    margin: 0;
  }
`;

const Title = styled.span`
  font-size: 2rem;
  font-family: "Playfair Display";
`;

type Value = "free" | "premium";

type PlanSelectInputProps = {
  value: Value;
  onChange: (val: Value) => void;
};

export function PlanSelectInput({ value, onChange }: PlanSelectInputProps) {
  return (
    <Container>
      <Button
        onClick={() => onChange("free")}
        className={classNames({ selected: value === "free" })}
        type="button"
      >
        <Title>Free</Title>
        <P grey>$0 forever</P>
      </Button>
      <Button
        onClick={() => onChange("premium")}
        className={classNames({ selected: value === "premium" })}
        type="button"
      >
        <Title>Premium</Title>
        <P grey>$9 / month</P>
      </Button>
    </Container>
  );
}
