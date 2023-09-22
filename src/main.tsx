import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { Footer } from "./components/index.ts";

const container: any = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <Footer />
    </ThemeProvider>
  </React.StrictMode>
);
