import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import VitePluginInjectPreload from "vite-plugin-inject-preload";

import solidPlugin from "vite-plugin-solid";

export default defineConfig({
    plugins: [
        solidPlugin(),
        ViteImageOptimizer(),
        VitePluginInjectPreload({
            files: [
                {
                    match: /.(png|jpg|jpeg|gif|svg|webp|avif|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2|eot|ttf|otf)/,
                },
            ],
        }),
    ],
    server: {
        port: 3000,
    },
    build: {
        target: "esnext",
    },
});
