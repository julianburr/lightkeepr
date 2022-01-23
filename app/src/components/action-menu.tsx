import { ComponentProps, useCallback } from "react";
import styled from "styled-components";

import { Button } from "./button";
import { Popout } from "./popout";
import { Items, PopoutMenu } from "./popout-menu";

import MoreSvg from "src/assets/icons/more-vertical.svg";

const Container = styled.div`
  min-width: 16rem;
  max-width: 21rem;
`;

function DefaultButton(props: ComponentProps<typeof Button>) {
  return <Button weight="ghost" icon={<MoreSvg />} {...props} />;
}

type ActionMenuProps = Omit<
  ComponentProps<typeof Popout>,
  "Content" | "children"
> & {
  items: Items;
  children?: ComponentProps<typeof Popout>["children"];
};

export function ActionMenu({
  items,
  children = DefaultButton,
  ...props
}: ActionMenuProps) {
  const Content = useCallback(
    ({ setVisible, element }) => (
      <Container>
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
