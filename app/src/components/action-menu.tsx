import { ComponentProps, useCallback } from "react";
import styled from "styled-components";

import { Popout } from "src/components/popout";
import { Items, PopoutMenu } from "src/components/popout-menu";
import { ActionButton } from "src/components/button";

const Container = styled.div<{ maxWidth?: string }>`
  min-width: 16rem;
  max-width: ${(props) => props.maxWidth || "28rem"};
`;

const DefaultButton = (props: any) => <ActionButton {...props} />;

type ActionMenuProps = Omit<
  ComponentProps<typeof Popout>,
  "Content" | "children"
> & {
  items: Items;
  maxWidth?: string;
  children?: ComponentProps<typeof Popout>["children"];
};

export function ActionMenu({
  items,
  maxWidth,
  children = DefaultButton,
  ...props
}: ActionMenuProps) {
  const Content = useCallback(
    ({ setVisible, element }) => (
      <Container maxWidth={maxWidth}>
        <PopoutMenu items={items} setVisible={setVisible} element={element} />
      </Container>
    ),
    [items]
  );
  return (
    <Popout Content={Content} {...props}>
      {children}
    </Popout>
  );
}
