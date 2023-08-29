import solid from 'solid-start/vite';
import vercel from 'solid-start-vercel';
import path from 'path';

import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		plugins: [solid({ ssr: true, adapter: vercel({ edge: false }) })],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
});
