import styled from "styled-components";

const Td = styled.td`
  max-width: 30rem;
  min-width: 20rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

type NodeCellProps = {
  value: {
    type: string;
    lhId: string;
    path: string;
    selector: string;
    boundingRect: {
      top: number;
      bottom: number;
      left: number;
      right: number;
      width: number;
      height: number;
    };
    snippet: string;
    nodeLabel: string;
  };
};

export function NodeCell({ value }: NodeCellProps) {
  return <Td title={value?.selector}>{value?.selector ?? "—"}</Td>;
}
