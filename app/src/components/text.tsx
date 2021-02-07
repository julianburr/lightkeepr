import styled from "styled-components";

function HeadingCore({ level, ...props }) {
  const Element = `h${level}`;
  return <Element {...props} />;
}

export const Heading = styled(HeadingCore)``;

export const P = styled.p``;

type SmallProps = {
  grey?: boolean;
};

export const Small = styled.p<SmallProps>`
  font-size: 1.2rem;
  color: ${(props) => (props.grey ? "#666" : "inherit")};
`;

export const Label = styled.label`
  font-size: 1.2rem;
  color: #666;
`;
