import path from 'node:path';
import url from 'node:url';
import vercel from 'solid-start-vercel';
import solid from 'solid-start/vite';

import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		plugins: [solid({ ssr: true, adapter: vercel({ edge: false }) })],
		resolve: {
			alias: {
				'@': path.resolve(
					path.dirname(url.fileURLToPath(import.meta.url)),
					'./src',
				),
			},
		},
	};
});
