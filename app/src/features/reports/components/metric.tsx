import styled from "styled-components";
import { Markdown } from "../../../components/markdown";

type MetricContainerProps = {
  neutral?: boolean;
  failure?: boolean;
  warning?: boolean;
  success?: boolean;
  selected?: boolean;
  faded?: boolean;
};

const MetricContainer = styled.button<MetricContainerProps>`
  width: 100%;
  position: relative;
  margin: 0.4rem 0;
  padding: 0 0 0 2.4rem;
  border: 0 none;
  background: none;
  cursor: pointer;
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  text-align: inherit;

  &:before {
    content: " ";
    position: absolute;
    height: 0.9rem;
    width: 0.9rem;
    top: 0.6rem;
    left: 0.2rem;
    background: ${(props) =>
      props.neutral
        ? "grey"
        : props.failure
        ? "red"
        : props.warning
        ? "orange"
        : "green"};
    border-radius: ${(props) =>
      props.neutral || props.success ? "50%" : ".2rem"};
    transform-origin: 50% 50%;
    transition: transform 0.2s, opacity 0.2s;
    transform: ${(props) => (props.selected ? "scale(1.2)" : "scale(1)")};
  }

  &:hover:before {
    transform: scale(1.2);
  }

  & p {
    margin: 0;
    padding: 0;
    display: inline;
  }
`;

type MetricProps = {
  item: any;
  audit: any;
  selected: string | null;
  setSelected: any;
  neutral?: boolean;
  failure?: boolean;
  warning?: boolean;
  success?: boolean;
};

export function Metric({
  item,
  audit,
  selected,
  setSelected,
  neutral,
  failure,
  warning,
  success,
}: MetricProps) {
  return (
    <MetricContainer
      onClick={() =>
        setSelected((state) => (state === item.id ? null : item.id))
      }
      neutral={neutral}
      failure={failure}
      warning={warning}
      success={success}
      selected={selected === item.id}
      faded={selected && selected !== item.id}
    >
      <Markdown>{audit.title}</Markdown>
    </MetricContainer>
  );
}
