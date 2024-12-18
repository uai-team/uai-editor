import { defineConfig } from 'vite'
import { resolve } from 'path';
import dts from 'vite-plugin-dts'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
    define: { 'process.env': process.env },
    build: {
        minify: "esbuild",
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'uai-editor',
            // fileName: (format) => `index.${format}.js`,
            fileName: `index`,
            formats: ['es', 'cjs']
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: { '@prefix': 'uai' },
                javascriptEnabled: true,
            },
        },
    },
    plugins: [
        dts({ rollupTypes: true }),
        createSvgIconsPlugin({
            iconDirs: [`${process.cwd()}/src/assets/icons`],
            symbolId: 'uai-icon-[name]',
            customDomId: 'uai-icons',
        })
        // legacy({
        //     targets: ['defaults', 'not IE 11','chrome 52'],
        // }),
    ],
    server: {
        proxy: {
            // 选项写法
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            'https://internlm-chat.intern-ai.org.cn/puyu': {
                target: 'https://internlm-chat.intern-ai.org.cn',
                changeOrigin: true
            }
        },
        hmr: {
            overlay: false
        },
        host: '0.0.0.0'
    }
})
