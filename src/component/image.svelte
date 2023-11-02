<script>
	import { onMount } from "svelte";

	export let src = "";
	export let srcBanner = "";
	export let style = "";
	export let alt = "";
	export let banner = false;
	export let isLoading = false;

	let loaded = false;
	let naturalWidth = 0;
	let naturalHeight = 0;
	let newHeight = 0;

	onMount(() => {
		const img = new Image();
		img.onload = () => {
			loaded = true;
			naturalWidth = img.naturalWidth;
			naturalHeight = img.naturalHeight;

			if (naturalWidth > 412) {
				const aspectRatio = naturalWidth / naturalHeight;
				newHeight = Math.floor(412 / aspectRatio);
				naturalWidth = 412;
			}
		};
		img.onerror = () => {
			loaded = false;
		};
		img.src = srcBanner;
	});

	$: loadingSpinnerStyle = banner ? "display:flex;justify-content:center;align-items:center; height: 60px;" : "width: 100px;display: inherit;height: 100px; vertical-align: middle;text-align: center;";
</script>

<!-- <div>
	debug: <br>
	isLoading {isLoading} <br>
	loaded {loaded} <br>
	src {src} <br>
</div> -->

{#if isLoading}
	<span style={loadingSpinnerStyle}>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" style="height: 32px; width: 32px;">
			<path fill="#4c4c4c" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
				<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
			</path>
		</svg>
	</span>
{:else if src || srcBanner}
	<img src={src || srcBanner} {alt} style={banner ? `${style} width: ${naturalWidth}px; height: ${newHeight}px` : style} />
{/if}
