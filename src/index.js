// index.js または main.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 既存の root 要素に対して createRoot を一度だけ呼び出します
const root = ReactDOM.createRoot(document.getElementById("root"));

// アプリケーションをレンダリングします
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
