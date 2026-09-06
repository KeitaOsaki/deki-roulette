import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import type { Locale } from "./i18n";

export function render(locale: Locale) {
  return renderToString(
    <StrictMode>
      <App locale={locale} />
    </StrictMode>
  );
}
