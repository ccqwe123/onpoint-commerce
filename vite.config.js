import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: true,      // allow external devices
        port: 5173,
        strictPort: true,
        cors: true,
        hmr: {
        host: "192.168.0.158", // 🔥 your computer's LAN IP
        },
    },
});
