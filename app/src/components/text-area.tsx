import { ComponentProps, forwardRef, useCallback } from "react";
import styled from "styled-components";

const Container = styled.textarea<{ error?: string }>`
  border: 0.1rem solid;
  border-color: ${(props) =>
    props.error
      ? `var(--sol--input-border-color-error)`
      : `var(--sol--input-border-color-default)`};
  border-radius: var(--sol--input-border-radius);
  min-height: 3.6rem;
  max-height: 15rem;
  padding: 0.6rem 0.8rem;
`;

type TextareaProps = ComponentProps<typeof Container> & {
  autoResize?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ autoResize, ...props }, ref) {
    // Handle auto resize
    const handleKeyDown = useCallback(
      (e) => {
        if (autoResize) {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }
      },
      [autoResize]
    );

    return <Container ref={ref} onInput={handleKeyDown} rows={1} {...props} />;
  }
);
