import { ReactNode } from "react";
import styled from "styled-components";

import { GroupHeading, P } from "./text";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1.6rem;
  margin: 0 -0.6rem;
  border-radius: 0.3rem;
  background: var(--sol--palette-sand-50);
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  p {
    margin: 0;
    line-height: 1.2;
  }
`;

type MetaObj = {
  key?: string;
  label: ReactNode;
  value?: ReactNode;
};

type MetaProps = {
  data: MetaObj[];
};

export function Meta({ data }: MetaProps) {
  return (
    <Container>
      {data.map((d, index) => (
        <Item key={d.key || index}>
          <GroupHeading>{d.label}</GroupHeading>
          <P grey>{d.value || d.value === 0 ? d.value : "—"}</P>
        </Item>
      ))}
    </Container>
  );
}
