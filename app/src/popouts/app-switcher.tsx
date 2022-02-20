import { ComponentProps } from "react";
import styled from "styled-components";

import { AppSwitcher } from "src/components/app-switcher";
import { Popout } from "src/components/popout";

const Container = styled.div`
  padding: 0.8rem;
  width: 26rem;
`;

function Content() {
  return (
    <Container>
      <AppSwitcher />
    </Container>
  );
}

type AppSwitcherPopoutProps = Omit<ComponentProps<typeof Popout>, "Content">;

export function AppSwitcherPopout(props: AppSwitcherPopoutProps) {
  return <Popout Content={Content} {...props} />;
}
