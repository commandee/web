import { defineConfig } from "astro/config";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: "https://commandee-web-production.up.railway.app",
  integrations: [sitemap(), image({
    serviceEntryPoint: "@astrojs/image/sharp"
  })],
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  build: {
    inlineStylesheets: "auto"
  },
  vite: {
    css: {
      postcss: {
        plugins: [autoprefixer(), cssnano()]
      }
    }
  }
});
