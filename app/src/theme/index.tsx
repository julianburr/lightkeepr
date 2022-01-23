import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  ::placeholder {
    color: #bbb;
  }

  html {
    font-size: 62.5%;
  }

  html, body, #__next {
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-weight: 400;
    font-size: 1.4rem;
    line-height: 1.4;
    background: #fff;
    color: #000;
  }

  @media (min-width: 800px) {
    body {
      font-size: 1.5rem;
    }
  }

  b {
    font-weight: 800;
  }

  h1 {
    font-size: 2.2em;
    font-weight: 900;
  }

  h2 {
    font-size: 1.6em;
    font-weight: 400;
  }

  h1, h2, h3, h4 {
    line-height: 1.05;
    margin: 0;
    font-family: "Playfair Display";
  }

  p {
    margin: .8rem 0;
  }

  input, button, textarea, select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: #2eb5bd;
    text-decoration: none;

    &:focus,
    &:hover {
      color: #2eb5bd;
      text-decoration: underline;
    }
  }
`;
