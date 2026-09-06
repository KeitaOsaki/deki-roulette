import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { localeFromPath, pageFromPath } from "./i18n";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

const { pathname } = window.location;

const app = (
  <StrictMode>
    <App locale={localeFromPath(pathname)} page={pageFromPath(pathname)} />
  </StrictMode>
);

// dev サーバは #root が空のまま配信される。プリレンダ済みの本番ビルドとで
// 入り口が変わるので、中身の有無で hydrate と初回描画を選び分ける。
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
