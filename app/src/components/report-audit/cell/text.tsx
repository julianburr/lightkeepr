import styled from "styled-components";

const NoWrap = styled.span`
  white-space: nowrap;
`;

type NoWrapProps = {
  value?: string;
};

export function TextCell({ value }: NoWrapProps) {
  const check = /^([0-9]+) x ([0-9]+)$/.test(value || "");
  return <td>{check ? <NoWrap>{value}</NoWrap> : value}</td>;
}
