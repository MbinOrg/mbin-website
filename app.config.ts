import { defineConfig } from '@solidjs/start/config';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  ssr: true,
  server: {
    preset: 'github-pages',
    prerender: {
      crawlLinks: true,
    },
  },
  vite: {
    plugins: [Icons({ compiler: 'solid' })],
  },
});
