import { ComponentProps, forwardRef, useState, Ref } from "react";
import styled from "styled-components";

import { Input } from "./text-input";

import EyeSvg from "src/assets/icons/eye.svg";
import EyeOffSvg from "src/assets/icons/eye-off.svg";

const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;

  input {
    padding-right: 5.2rem;
  }
`;

const Button = styled.button`
  && {
    position: absolute;
    display: flex;
    top: 50%;
    right: 0.8rem;
    transform: translateY(-50%);
    padding: 0.4rem;
    margin: 0;
    border: 0 none;
    background: transparent;
    width: auto;
    height: auto;

    svg {
      height: 1.2em;
      width: auto;
    }
  }
`;

export const PasswordInput = forwardRef(function PasswordInput(
  props: ComponentProps<typeof Input>,
  ref: Ref<any>
) {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <Input type={visible ? "text" : "password"} ref={ref} {...props} />
      <Button
        type="button"
        onClick={() => setVisible((state) => !state)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOffSvg /> : <EyeSvg />}
      </Button>
    </Container>
  );
});
