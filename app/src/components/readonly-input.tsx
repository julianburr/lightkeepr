import { ReactNode } from "react";
import styled from "styled-components";

import { P } from "./text";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3.6rem;
  background: #f5f4f1;
  border-radius: 0.3rem;
  padding: 0 0.8rem;
`;

const Value = styled(P)`
  flex: 1;
`;

const Anyfix = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justift-content: center;
  gap: 0.3rem;
  height: 3.6rem;
  min-width: 3.6rem;
  padding: 0 0.4rem;
`;

const Prefix = styled(Anyfix)`
  margin: 0 0 0 -0.8rem;
`;

const Suffix = styled(Anyfix)`
  margin: 0 -0.8rem 0 0;
`;

type ReadonlyInputProps = {
  id?: string;
  name?: string;
  value?: string | number;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export function ReadonlyInput({
  id,
  name,
  value,
  prefix,
  suffix,
}: ReadonlyInputProps) {
  return (
    <>
      <input id={id} type="hidden" name={name} value={value} />
      <Container>
        {prefix && <Prefix>{prefix}</Prefix>}
        <Value>{value || "—"}</Value>
        {suffix && <Suffix>{suffix}</Suffix>}
      </Container>
    </>
  );
}
