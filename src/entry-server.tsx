import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { ROUTES, routeFile } from "./routes";

/** 静的に配る全ページを文字列へ描画する。`file` はエントリ HTML の `dist/` 内のパス。 */
export function renderAll() {
  return ROUTES.map((route) => ({
    file: routeFile(route),
    markup: renderToString(
      <StrictMode>
        <App locale={route.locale} page={route.page} />
      </StrictMode>
    ),
  }));
}
