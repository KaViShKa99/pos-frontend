import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import sinTranslation from "./languages/sin.json";

i18n.init({
  interpolation: { escapeValue: false }, // Optional: Disable escaping HTML entities
  lng: "sin", // Set the default language
  resources: {
    sin: { translation: sinTranslation }
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <I18nextProvider i18n={i18n}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    ,
  </I18nextProvider>
);
