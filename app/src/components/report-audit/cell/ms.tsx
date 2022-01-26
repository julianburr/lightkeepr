import styled from "styled-components";

const Td = styled.td`
  white-space: nowrap;
`;

type MsCellProps = {
  value: number;
};

export function MsCell({ value }: MsCellProps) {
  return <Td>{Number.isNaN(value) ? "—" : `${Math.ceil(value)} ms`}</Td>;
}
