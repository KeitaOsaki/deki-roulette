import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import type { Locale, Page } from "./i18n";

export function render(locale: Locale, page: Page) {
  return renderToString(
    <StrictMode>
      <App locale={locale} page={page} />
    </StrictMode>
  );
}
