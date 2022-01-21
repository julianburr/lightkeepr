import { ComponentProps, useCallback } from "react";
import styled from "styled-components";

import { Popout } from "./popout";
import { Items, PopoutMenu } from "./popout-menu";

const Container = styled.div`
  min-width: 16rem;
  max-width: 19rem;
`;

type ActionMenuProps = Omit<ComponentProps<typeof Popout>, "Content"> & {
  items: Items;
};

export function ActionMenu({ items, ...props }: ActionMenuProps) {
  const Content = useCallback(
    ({ setVisible, element }) => (
      <Container>
        <PopoutMenu items={items} setVisible={setVisible} element={element} />
      </Container>
    ),
    [items]
  );
  return <Popout Content={Content} {...props} />;
}
