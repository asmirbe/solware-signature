import adapter from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	ssr: true,
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		alias: {
      $lib: 'src/lib',
      $components: 'src/component',
			$scss: 'src/scss',
    }
	},
};

export default config;
