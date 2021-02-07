import styled from "styled-components";

export const TitleBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 1.2rem 0;

  & h1 {
    margin: 0;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    & > * {
      margin-top: 0.6rem;

      &:first-child {
        margin-top: 0;
      }
    }
  }
`;
