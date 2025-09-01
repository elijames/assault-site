import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  base: process.env.PUBLIC_SITE_URL ? new URL(process.env.PUBLIC_SITE_URL).pathname : '/',
  integrations: [tailwind()]
});