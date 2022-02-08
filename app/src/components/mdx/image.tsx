import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import styled from "styled-components";

import { Text } from "src/components/text";

const Figure = styled.figure`
  width: 100%;
  max-width: 68rem;
  margin: 3.2rem auto;
  padding: 0;

  a {
    display: flex;
  }

  img {
    width: 100%;
    height: auto;
    border: 0.1rem solid var(--sol--palette-sand-300);
    border-radius: var(--sol--border-radius-s);
  }

  figcaption {
    font-size: 1.2rem;
    text-align: center;
    padding: 0 10%;
    margin: 0.6rem 0 0;
    font-family: "Playfair Display";
  }
`;

export function Image(
  props: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) {
  return (
    <Figure>
      <a href={props.src} target="_blank" rel="noreferrer nofollow">
        <img {...props} />
      </a>
      <Text as="figcaption" grey>
        {props.alt}
      </Text>
    </Figure>
  );
}
