import { Button } from "./button";

import MoreSvg from "src/assets/icons/more-vertical.svg";
import styled from "styled-components";
import { ActionMenu } from "./action-menu";
import { ComponentProps } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.1rem;

  & button {
    &:first-child {
      border-radius: 0.3rem 0 0 0.3rem;
    }

    &:last-child {
      border-radius: 0 0.3rem 0.3rem 0;
    }
  }
`;

type ActionButtonProps = ComponentProps<typeof Button> & {
  items: ComponentProps<typeof ActionMenu>["items"];
  placement?: ComponentProps<typeof ActionMenu>["placement"];
};

export function ActionButton({
  items,
  placement,
  ...props
}: ActionButtonProps) {
  return (
    <Container>
      <Button {...props} />
      <ActionMenu items={items} placement={placement}>
        {(p) => (
          <Button
            {...p}
            intent={props.intent}
            size={props.size}
            icon={<MoreSvg />}
          />
        )}
      </ActionMenu>
    </Container>
  );
}
