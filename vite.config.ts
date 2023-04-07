import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

import solidPlugin from "vite-plugin-solid";

export default defineConfig({
    plugins: [solidPlugin(), ViteImageOptimizer()],
    server: {
        port: 3000,
    },
    build: {
        target: "esnext",
    },
});
