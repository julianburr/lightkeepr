import styled from "styled-components";

const Td = styled.td`
  overflow-wrap: anywhere;
`;

type SourceLocationCellType = {
  value?: {
    type: string;
    url: string;
    urlProvider: string;
    line: number;
    column: number;
  };
};

export function SourceLocationCell({ value }: SourceLocationCellType) {
  return <Td>{value ? `${value.url}:${value.line}:${value.column}` : "—"}</Td>;
}
