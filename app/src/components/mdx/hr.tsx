import styled from "styled-components";

const Line = styled.hr`
  border: 0 none;
  border-top: 0.1rem solid var(--sol--palette-sand-200);
  width: 100%;
  max-width: 8rem;
  margin: 5.4rem auto;
`;

export function Hr(props: any) {
  return <Line {...props} />;
}
