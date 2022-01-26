import styled from "styled-components";

const Td = styled.td`
  white-space: nowrap;
`;

function format(value: number) {
  if (value >= 1024 * 1024) {
    return `${Math.ceil((value / (1024 * 1024)) * 10) / 10} MiB`;
  }

  if (value >= 1024) {
    return `${Math.ceil((value / 1024) * 10) / 10} KiB`;
  }

  return `${Math.ceil(value)} B`;
}

type BytesCellProps = {
  value: number;
};

export function BytesCell({ value }: BytesCellProps) {
  return <Td>{Number.isNaN(value) ? "—" : format(value)}</Td>;
}
