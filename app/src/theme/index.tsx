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
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 1.4;
    color: #000;
  }

  b {
    font-weight: 800;
  }

  h1 {
    font-size: 2.8em;
  }

  h2 {
    font-size: 2.2em;
  }

  h3 {
    font-size: 1.4em;
  }

  h4 {
    font-size: 1em;
  }

  h1, h2, h3, h4 {
    font-weight: 600;
    line-height: 1.05;
    font-family: "Yanone Kaffeesatz";
    margin: 0;
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
`;
