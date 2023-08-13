import tailwind from "@astrojs/tailwind";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

import { defineConfig } from "astro/config";
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: "https://commandee.com",
  integrations: [tailwind(), sitemap(), prefetch({
    selector: 'a[href]'
  })],
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  build: {
    inlineStylesheets: "auto"
  },
  experimental: {
    assets: true,
    viewTransitions: true
  },
  vite: {
    css: {
      postcss: {
        plugins: [autoprefixer(), cssnano()]
      }
    }
  }
});
