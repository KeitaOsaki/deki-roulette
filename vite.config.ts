/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import { cloudflare } from "@cloudflare/vite-plugin";
import { ROUTES, routeFile } from "./src/routes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SSR バンドルは Node で実行してプリレンダするだけ、テストも Node で走るので、
// Workers ランタイムを前提にする cloudflare プラグインは外す。
const ssrBuild = process.env.BUILD_TARGET === "ssr";
const nodeRuntime = ssrBuild || process.env.VITEST !== undefined;

export default defineConfig({
  plugins: nodeRuntime ? [react()] : [react(), cloudflare()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: ssrBuild
    ? {}
    : {
        rollupOptions: {
          input: Object.fromEntries(
            ROUTES.map((route) => [
              `${route.locale}-${route.page}`,
              resolve(__dirname, routeFile(route)),
            ])
          ),
        },
      },
  test: {
    // .claude/worktrees に別ブランチのリポジトリ複製が置かれるので、探索を src に絞る
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
