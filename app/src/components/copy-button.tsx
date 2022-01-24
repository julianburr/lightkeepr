import { useCallback, useRef, Ref, ComponentProps } from "react";
import styled from "styled-components";

import { useToast } from "src/hooks/use-toast";
import { Button } from "src/components/button";

import ClipboardSvg from "src/assets/icons/clipboard.svg";

const Input = styled.input`
  display: none;
`;

type CopyButtonProps = Partial<
  Omit<ComponentProps<typeof Button>, "onClick" | "href">
> & {
  text: string;
};

export function CopyButton({ text, ...props }: CopyButtonProps) {
  const toast = useToast();

  const inputRef = useRef<HTMLInputElement>();
  const handleClick = useCallback((e) => {
    if (inputRef.current) {
      inputRef.current.value = text;
      inputRef.current.select();
      window.document.execCommand("copy");
      toast.show({ message: "Copied to clipboard" });
    }
  }, []);

  return (
    <>
      <Input ref={inputRef as Ref<HTMLInputElement>} type="text" />
      <Button icon={<ClipboardSvg />} {...props} onClick={handleClick} />
    </>
  );
}
