<script>
	// Importing scss file and svelte store, component and library
	import "../scss/main.scss";
	import { onMount, onDestroy } from "svelte";
	import user, { isHelpOpen } from "$lib/store";
	import { Notification } from "$components/notification";
	import ClipboardJS from "clipboard";
	import Signature from "$components/Signature.svelte"
	import { lang, txtApp } from "$lib/constants";
	import { loadImage, fadeTranslateScale } from "$lib/util";
	import { signLoading } from "$lib/store";
	import Sidebar from "$components/Sidebar.svelte";
	import Modal from "$components/Modal.svelte";
	import circle from "$assets/circle.png";
	let htmlSignature;
	let clipboard;

	// $: console.log(htmlSignature);
	onMount(() => {
		const images = document.querySelectorAll("img[data-src]");
		images.forEach((img) => {
			loadImage(
				img,
				(loadedImg) => {
					loadedImg.removeAttribute("data-src");
				},
				() => {
					console.log(`Error loading image: ${img.dataset.src}`);
				}
			);
		});
		clipboard = new ClipboardJS(".btn");
		// clipboard.on("success", handleSuccess);
	});

	onDestroy(() => {
		if (clipboard) {
			// clipboard.off("success", handleSuccess);
		}
	});


	function closeModal() {
		isHelpOpen = false;
	}
</script>

<svelte:head>
	<title>Email signature - Solware</title>
</svelte:head>

{#if !$signLoading}
	<Sidebar />
	<div class="container">
		<!-- <svg class="circle" viewBox="0 0 783 955" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_f_1209_21)">
				<circle cx="916.965" cy="37.9644" r="516.813" transform="rotate(-105 916.965 37.9644)" fill="url(#paint0_angular_1209_21)" />
			</g>
			<defs>
				<filter id="filter0_f_1209_21" x="0.0234375" y="-878.977" width="1833.88" height="1833.88" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
					<feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_1209_21" />
				</filter>
				<radialGradient id="paint0_angular_1209_21" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(916.965 37.9644) rotate(90) scale(516.813)">
					<stop stop-color="#349DFB" />
					<stop offset="1" stop-color="#7FF21A" />
				</radialGradient>
			</defs>
		</svg> -->
		<div class="circle">
			<div class="green"></div>
		</div>

		{#if $isHelpOpen}
			<div class="desc" transition:fadeTranslateScale={{ from: "left-top", duration: 180 }}>
				<header class="head">
					<h5>{txtApp.infosTitle}</h5>
					<button class="btn -secondary -round -small" style="padding: 0.2rem;" on:click={() => ($isHelpOpen = false)}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
							<path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
						</svg>
					</button>
				</header>
				{@html txtApp.infosText}
				<footer class="foot">
					<div class="field">
						<label for="token">Votre token utilisateur</label>
						<input type="text" id="token" readonly value={$user.identifiers.userUniqueToken} />
					</div>
				</footer>
			</div>
		{/if}
		<div class="signature">
			<Notification />
			<div class="card">
				<header class="card-header">Votre signature</header>
				<div class="card-content">
					<Signature/>
				</div>
			</div>
		</div>
	</div>
{/if}
