import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { link } from "./src/config/config.js";

export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        port: 8190,   // 新的端口号
        host: '0.0.0.0'  // 允许局域网访问
    },
    base: link,
    resolve: {
        alias: {
            '@': '/src',
            // 其他别名
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "sass:math";
                    @use "sass:color";
                `
            }
        }
    }
});
