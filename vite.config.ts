import unplugin from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: './',
  root: './src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext'
  },
  server: {
    host: '0.0.0.0'
  },
  plugins: [
    react({ plugins: [], devTarget: 'esnext' }),
    paths({ root: '../' }),
    unplugin({
      google: {
        families: [
          'Roboto Mono',
          'JetBrains Mono'
        ]
      }
    })
  ],
});
