import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            // FIX: Replaced `path.resolve(__dirname, ...)` with `path.resolve(...)` because `__dirname` is not available in ES modules by default. The path will be resolved from the project root, which is the intended behavior.
            main: path.resolve('index.html'),
            about: path.resolve('about.html'),
            careers: path.resolve('careers.html'),
            contact: path.resolve('contact.html'),
            'architectural-design': path.resolve('architectural-design.html'),
            'engineering-consultancy': path.resolve('engineering-consultancy.html'),
            'project-management': path.resolve('project-management.html'),
            'sustainability-energy': path.resolve('sustainability-energy.html'),
          },
        },
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve('.'),
        }
      }
    };
});