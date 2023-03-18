import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: {
			$components: path.resolve('./src/component'),
			$stores: path.resolve('./src/store'),
		}
	}
};

export default config;