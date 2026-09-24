import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import { cloudflare } from "@cloudflare/vite-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SSR バンドルは Node で実行してプリレンダするだけなので、
// Workers ランタイムを前提にする cloudflare プラグインは外す。
const ssrBuild = process.env.BUILD_TARGET === "ssr";

export default defineConfig({
  plugins: ssrBuild ? [react()] : [react(), cloudflare()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: ssrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            ja: resolve(__dirname, "index.html"),
            en: resolve(__dirname, "en/index.html"),
            jaOrder: resolve(__dirname, "order/index.html"),
            enOrder: resolve(__dirname, "en/order/index.html"),
            jaPrivacy: resolve(__dirname, "privacy/index.html"),
            enPrivacy: resolve(__dirname, "en/privacy/index.html"),
          },
        },
      },
});
