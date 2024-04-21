import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
            '@/app': resolve(__dirname, './app'),
            '@/types': resolve(__dirname, './types'),
        }
    },
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
    },
})