import styled from "styled-components";

type SpacerProps = {
  width?: string;
  height?: string;
  size?: string;
};

export const Spacer = styled.div<SpacerProps>`
  width: ${(props) => props.width || props.size || ".1rem"};
  height: ${(props) => props.height || props.size || ".1rem"};
`;
