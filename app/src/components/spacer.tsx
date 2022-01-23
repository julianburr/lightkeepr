import styled from "styled-components";

export const Spacer = styled.div<{
  h?: string;
  height?: string;
  w?: string;
  width?: string;
}>`
  display: flex;
  height: ${(props) => props.h || props.height || ".1rem"};
  width: ${(props) => props.w || props.width || ".1rem"};
  flex-shrink: 0;
`;
