import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { captureUtmsFromUrl } from "./lib/tracking";

// Capture UTM / click-id params from landing URL into sessionStorage
// so outbound links (e.g. Amazon pre-order) can carry them through.
captureUtmsFromUrl();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
