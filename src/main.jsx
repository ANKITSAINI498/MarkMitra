import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { MarkdownProvider } from "./context/MarkdownContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MarkdownProvider>
        <App />
      </MarkdownProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
