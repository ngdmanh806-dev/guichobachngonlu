import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css"; // Đảm bảo đường dẫn này đúng với file CSS của bạn
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
