
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://sarath-asic.github.io';

export default defineConfig({
  site,
  base: '/engineering-portfolio',
  integrations: [sitemap()],
  build: { format: 'directory' },
  trailingSlash: 'always',
});
