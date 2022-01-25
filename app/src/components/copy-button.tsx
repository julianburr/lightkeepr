import { useCallback, useRef, Ref, ComponentProps } from "react";
import styled from "styled-components";

import { useToast } from "src/hooks/use-toast";
import { Button } from "src/components/button";

import ClipboardSvg from "src/assets/icons/clipboard.svg";
import { Tooltip } from "./tooltip";

const TextArea = styled.textarea`
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
`;

type CopyButtonProps = Partial<
  Omit<ComponentProps<typeof Button>, "onClick" | "href">
> & {
  text: string;
};

export function CopyButton({ text, ...props }: CopyButtonProps) {
  const toast = useToast();

  const inputRef = useRef<HTMLTextAreaElement>();
  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = text;
      inputRef.current.select();
      window.document.execCommand("copy");
      toast.show({ message: "Copied to clipboard" });
    }
  }, []);

  return (
    <>
      <TextArea
        ref={inputRef as Ref<HTMLTextAreaElement>}
        tabIndex={-1}
        data-rcf-exclude
      />
      <Tooltip content="Copy to clipboard">
        {(tooltipProps) => (
          <Button
            icon={<ClipboardSvg />}
            {...tooltipProps}
            {...props}
            onClick={handleClick}
          />
        )}
      </Tooltip>
    </>
  );
}
