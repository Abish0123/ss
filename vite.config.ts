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
            main: path.resolve(__dirname, 'index.html'),
            about: path.resolve(__dirname, 'about.html'),
            careers: path.resolve(__dirname, 'careers.html'),
            contact: path.resolve(__dirname, 'contact.html'),
            'architectural-design': path.resolve(__dirname, 'architectural-design.html'),
            'engineering-consultancy': path.resolve(__dirname, 'engineering-consultancy.html'),
            'project-management': path.resolve(__dirname, 'project-management.html'),
            'sustainability-energy': path.resolve(__dirname, 'sustainability-energy.html'),
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
