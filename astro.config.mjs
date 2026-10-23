import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL in Netlify (or here) once the final domain is known; canonical URLs and the sitemap use it.
const site = process.env.SITE_URL || 'https://zesty-choux-f5121f.netlify.app';

export default defineConfig({
  site,
  integrations: [sitemap()],
  build: { format: 'directory' },
  trailingSlash: 'always',
});
