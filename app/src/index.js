import "./utils/firebase";

import { StrictMode, Suspense } from "react";
import { render } from "react-dom";
import { FirebaseProvider } from "react-firebase-context";

import { App } from "./app";
import { reportWebVitals } from "./utils/report-web-vitals";

render(
  <StrictMode>
    <Suspense fallback={<p>Loading...</p>}>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </Suspense>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
