import { ReactNode, Ref, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import CheckSvg from "src/assets/icons/check.svg";

const Container = styled.div`
  input {
    position: absolute;
    pointer-events: none;
    opacity: 0;
  }

  label {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    min-height: 3.6rem;
    gap: 0.8rem;
    cursor: pointer;
    padding: 0.8rem 0 0;
  }
`;

const Box = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.8rem;
  width: 1.8rem;
  border-radius: var(--sol--border-radius-s);
  background: var(--sol--palette-sand-500);
  transition: background 0.2s;

  label:hover > &,
  label:focus > & {
    background: var(--sol--palette-sand-600);
  }

  svg {
    height: 1.4rem;
    width: auto;
    color: #fff;
    transition: opacity 0.2s, transform 0.2s ease-in-out;
    transform: scale(0.9);
    opacity: 0;
  }

  input:checked + label > & {
    background: var(--sol--color-brand-500);

    svg {
      transform: scale(1);
      opacity: 1;
    }
  }

  input:checked + label:hover > &,
  input:checked + label:focus > & {
    background: var(--sol--color-brand-600);
  }
`;

const WrapLabel = styled.span`
  margin: -0.1rem 0 0;
`;

type CheckboxInputProps = {
  name: string;
  label?: ReactNode;
  disabled?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => any;
};

let uuid = 0;

export function CheckboxInput({
  name,
  label,
  value = false,
  onChange,
}: CheckboxInputProps) {
  const [instanceUuid] = useState(++uuid);

  const boxRef = useRef<HTMLSpanElement>();
  const labelRef = useRef<HTMLLabelElement>();
  useEffect(() => {
    function handleKeyDown(e: any) {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        onChange?.(!value);
      }
    }
    boxRef.current?.addEventListener?.("keydown", handleKeyDown);
    return () =>
      boxRef.current?.removeEventListener?.("keydown", handleKeyDown);
  }, [value]);

  return (
    <Container>
      <input
        id={`checkbox-${instanceUuid}`}
        type="checkbox"
        name={name}
        tabIndex={-1}
        checked={value}
        onChange={(e) => onChange?.(e.target.checked)}
      />

      <label
        ref={labelRef as Ref<HTMLLabelElement>}
        htmlFor={`checkbox-${instanceUuid}`}
      >
        <Box ref={boxRef as Ref<HTMLSpanElement>} tabIndex={0}>
          <CheckSvg />
        </Box>
        <WrapLabel>{label}</WrapLabel>
      </label>
    </Container>
  );
}
