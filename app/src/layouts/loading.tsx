import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export function LoadingLayout({ text = "Loading..." }) {
  return (
    <Container>
      <p>{text}</p>
    </Container>
  );
}
