import styled from "styled-components";

import { useAuthUser } from "src/hooks/use-auth-user";
import { ActionMenu } from "src/components/action-menu";
import { P, Small } from "src/components/text";
import { ComponentProps } from "react";

const Email = styled(Small)`
  && {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0.6rem 0 0;
  }
`;

type AccountActionMenuProps = ComponentProps<typeof ActionMenu>;

export function AccountActionMenu({ items, ...props }: AccountActionMenuProps) {
  const authUser = useAuthUser();

  return (
    <ActionMenu
      {...props}
      maxWidth="22rem"
      items={[
        {
          isCustom: true,
          Content: () =>
            authUser?.user ? (
              <>
                <P>You are currently logged in as {authUser?.user?.name}</P>
                <Email grey>{authUser?.user?.id}</Email>
              </>
            ) : (
              <P grey>You are currently not logged in</P>
            ),
        },
        ...items,
      ]}
    />
  );
}
