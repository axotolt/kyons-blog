import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
// import vercel from '@astrojs/vercel/serverless';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
// import node from "@astrojs/node";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), solidJs(), tailwind(), react()],
  adapter: vercel()
});