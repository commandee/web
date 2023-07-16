import type { AstroUserConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

import image from "@astrojs/image";

// https://astro.build/config
export default {
  site: "https://commandee.com",
  integrations: [tailwind(), sitemap(), image()],
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  build: {
    inlineStylesheets: "auto"
  },
  experimental: {
    assets: true,
    redirects: true
  },
  vite: {
    css: {
      postcss: {
        plugins: [autoprefixer(), cssnano()]
      }
    }
  }
} satisfies AstroUserConfig;
