import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://stan-buren.github.io',
    base: '/emozika-theatre-cinema-school/',
    integrations: [sitemap()],
});