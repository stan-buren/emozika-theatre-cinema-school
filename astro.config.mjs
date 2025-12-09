import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://emozika-spb.ru', // TODO: Update with actual domain
    integrations: [sitemap()],
});