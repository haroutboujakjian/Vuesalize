import { fileURLToPath, URL } from "node:url"
import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.js"),
            name: "Vuesalize",
            fileName: "vuesalize",
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled into your library
            external: ["vue"],
            output: {
                assetFileNames: "vuesalize.[ext]",
                // Provide global variables to use in the UMD build for externalized deps
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
})
