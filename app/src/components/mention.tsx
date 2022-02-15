import styled from "styled-components";

export const Mention = styled.span`
  background: var(--sol--color-brand-500);
  color: var(--sol--color-white);
  padding: 0.1rem 0.3rem;
  border-radius: 0.3rem;

  &:before {
    content: "@";
  }
`;
