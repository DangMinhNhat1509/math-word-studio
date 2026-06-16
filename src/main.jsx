import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./App.jsx";
import AuthGate from "./components/auth/AuthGate.jsx";
import "./index.css";
import "./styles/mathlive-editor.css";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontWeight: "850",
  },
  defaultRadius: "md",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <AuthGate>
        <App />
      </AuthGate>
    </MantineProvider>
  </React.StrictMode>
);
