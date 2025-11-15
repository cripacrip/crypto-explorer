import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, path.resolve(__dirname, '../../'), '') };

  return defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: parseInt(process.env.PORT || '5000'),
      host: process.env.HOST || '127.0.0.1',
      proxy: {
        '/api': {
          target: 'http://backend:5000',
          changeOrigin: true,
          rewrite: (p) => p,
        },
      },
    },
  });
};