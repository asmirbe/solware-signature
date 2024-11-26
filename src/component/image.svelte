<!-- Image.svelte -->
<script>
	import { onMount } from "svelte";

	export let src;
	export let style;
	export let alt;
	export let banner = false;
	export let isLoading = false;

	let loaded = false;
	let error = false;
	let naturalWidth = 0;
	let naturalHeight = 0;
	let newHeight = 0;
	let img;
	let currentSrc = "";

	// Watch for src or isLoading changes
	$: {
		if (isLoading) {
			// Clear current image when loading starts
			loaded = false;
			error = false;
			currentSrc = "";
		} else if (src !== currentSrc) {
			// Only load new image if src has changed and we're not loading
			loaded = false;
			error = false;
			currentSrc = src;
			if (src) loadImage();
		}
	}

	function loadImage() {
		if (!src) return;

		img = new Image();

		img.onload = () => {
			if (src === currentSrc) {
				// Only update if this is still the current image
				loaded = true;
				naturalWidth = img.naturalWidth;
				naturalHeight = img.naturalHeight;

				// Check if the natural width is greater than 410
				if (naturalWidth > 412) {
					// Calculate the new height based on the aspect ratio
					const aspectRatio = naturalWidth / naturalHeight;
					newHeight = Math.floor(412 / aspectRatio);
					naturalWidth = 412;
				}
			}
		};

		img.onerror = () => {
			if (src === currentSrc) {
				// Only update if this is still the current image
				error = true;
				console.error("Error loading image:", src);
			}
		};

		img.src = src;
	}

	onMount(() => {
		if (src && !isLoading) {
			loadImage();
		}

		return () => {
			// Cleanup
			if (img) {
				img.onload = null;
				img.onerror = null;
			}
		};
	});
</script>

<!-- Loading spinner -->
{#if isLoading || (!loaded && !error && currentSrc)}
	<span style={banner ? `display:flex;justify-content:center;align-items:center; height: 60px;` : "width: 100px;display: inherit;height: 100px; vertical-align: middle;text-align: center;"}>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" style="height: 32px; width: 32px;">
			<path fill="#4c4c4c" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
				<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
			</path>
		</svg>
	</span>
{/if}

<!-- Loaded image -->
{#if loaded && currentSrc && !isLoading}
	<img src={currentSrc} {alt} style={banner ? `${style} width: ${naturalWidth}px; height: ${newHeight}px` : style} />
{/if}

<!-- Error state -->
{#if error}
	<span style="color: #ff0000;">Failed to load image</span>
{/if}
