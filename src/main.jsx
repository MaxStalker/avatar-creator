import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Loader } from "@react-three/drei";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
    <Loader />
  </React.StrictMode>,
  document.getElementById("root")
);