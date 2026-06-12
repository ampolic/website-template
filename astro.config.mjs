import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import { visualizer } from "rollup-plugin-visualizer";

const site = process.env.SITE_URL ?? "https://example.com";
const analyzeBundle = process.env.BUNDLE_ANALYZE === "true";

export default defineConfig({
  site,
  output: "static",
  build: {
    inlineStylesheets: "always",
  },
  prefetch: true,
  trailingSlash: "never",
  integrations: [react(), mdx(), sitemap(), compress()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        plugins: analyzeBundle
          ? [
              visualizer({
                filename: "./dist/bundle-stats.html",
                gzipSize: true,
                brotliSize: true,
                open: false,
                template: "treemap",
              }),
            ]
          : [],
      },
    },
  },
});
