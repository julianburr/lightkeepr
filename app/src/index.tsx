import "./utils/firebase";

import { StrictMode, Suspense } from "react";
import { render, hydrate } from "react-dom";
import { createGlobalStyle } from "styled-components";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app";
import { LoadingLayout } from "./layouts/loading";
import { FirebaseProvider } from "./hooks/@firebase";

const Styles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 62.5%;
  }

  body {
    font-family: -apple-system, sans-serif;
    font-size: 1.6rem;
    line-height: 1.4;
    font-weight: 400;
    color: #222;

    & b {
      font-weight: 700;
    }

    & h1 {
      font-size: 2.2rem;
    }
  }

  input, select, textarea, button {
    font: inherit;
  }
`;

function Root() {
  return (
    <StrictMode>
      <Suspense fallback={<LoadingLayout />}>
        <BrowserRouter>
          <FirebaseProvider>
            <Styles />
            <App />
          </FirebaseProvider>
        </BrowserRouter>
      </Suspense>
    </StrictMode>
  );
}

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<Root />, rootElement);
} else {
  render(<Root />, rootElement);
}
