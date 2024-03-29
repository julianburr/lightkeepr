import { createGlobalStyle } from "styled-components";

import { tokensToVars } from "src/@packages/sol/tokens";

import { tokens } from "./tokens";

export const GlobalStyles = createGlobalStyle`
  :root {
    ${tokensToVars(tokens)}
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }

  ::placeholder {
    color: var(--sol--palette-grey-200);
  }

  html {
    font-size: 62.5%;
    scroll-padding-top: 6.8rem;
    height: 100%;
  }

  html, body, #__next {
    width: 100%;
    display: flex;
    flex:1;
    flex-direction: column;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--sol--typography-family-default);
    font-weight: 400;
    font-size: 1.4rem;
    line-height: 1.4;
    background: var(--sol--color-white);
    color: var(--sol--typography-color-default);
    overflow-wrap: anywhere;
    height: 100%;
  }

  body.noscroll {
    overflow: hidden;
  }

  body.noscroll-comments, 
  body.noscroll-dialog {
    overflow:hidden;
  }

  @media (min-width: 800px) {
    body {
      font-size: 1.5rem;
    }

    body.noscroll {
      overflow: auto;
    }
  }

  b, strong {
    font-weight: 700;
  }

  h1 {
    font-size: 2.3em;
    font-weight: 900;
  }

  h2 {
    font-size: 1.9em;
    font-weight: 400;
  }

  h3 {
    font-size: 1.3em;
    font-weight: 400;
  }

  h1, h2, h3, h4 {
    line-height: 1.05;
    margin: 0;
    font-family: var(--sol--typography-family-heading);

    svg {
      display: inline-flex;
      height: 1em;
      width: auto;
      vertical-align: middle;
      margin: 0 .4rem 0 0;
    }
  }

  p {
    margin: .8rem 0;
  }

  p code, 
  span code,
  li code {
    font-family: "Source Code Pro", Consolas, Monaco, "Andale Mono", "Ubuntu Mono";
    display: inline-block;
    vertical-align: center;
    font-size: 0.9em;
  }

  input, button, textarea, select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: var(--sol--typography-color-link-default);
    text-decoration: none;
    transition: color .2s;

    &:focus,
    &:hover {
      color: var(--sol--typography-color-link-hover);
      text-decoration: underline;
    }

    &:active {
      color: var(--sol--typography-color-link-active);
      text-decoration: underline;
    }
  }
`;
