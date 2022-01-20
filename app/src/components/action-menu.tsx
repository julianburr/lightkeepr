import { ComponentProps, useCallback } from "react";

import { Popout } from "./popout";
import { Items, PopoutMenu } from "./popout-menu";

type ActionMenuProps = Omit<ComponentProps<typeof Popout>, "Content"> & {
  items: Items;
};

export function ActionMenu({ items, ...props }: ActionMenuProps) {
  const Content = useCallback(
    ({ setVisible, element }) => (
      <PopoutMenu items={items} setVisible={setVisible} element={element} />
    ),
    [items]
  );
  return <Popout Content={Content} {...props} />;
}
