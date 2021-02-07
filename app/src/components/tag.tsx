import styled from "styled-components";

type TagProps = {
  success?: boolean;
  failure?: boolean;
};

export const Tag = styled.div<TagProps>`
  padding: 0.6rem 1.2rem;
  border-radius: 0.2rem;
  border-width: 0.1rem;
  border-style: solid;
  color: ${(props) =>
    props.success ? "green" : props.failure ? "red" : "blue"};
  border-color: currentColor;
`;
