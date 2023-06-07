import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  vite: {
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          cssnano()
        ]
      }
    }
  }
});
