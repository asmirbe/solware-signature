<script>
	// Importing scss file and svelte store, component and library
	import "../scss/main.scss";
	import { onMount, onDestroy } from "svelte";
	import user, { isHelpOpen } from "$lib/store";
	import { Notification } from "$components/notification";
	import ClipboardJS from "clipboard";
	import Image from "$components/Image.svelte";
	import { fade } from "svelte/transition";
	import { lang, brandOptions, txtApp } from "$lib/constants";
	import { formatPhone, loadImage, checkImageUrl, getBase64, objectsAreEqual, fadeTranslateScale } from "$lib/util";
	import { isLoading, signLoading } from "$lib/store";
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

	$: selectedLink = brandOptions.find((brand) => brand.id === $user.preferences.brand) || brandOptions[0];

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
		<svg class="circle" viewBox="0 0 783 955" fill="none" xmlns="http://www.w3.org/2000/svg">
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
		</svg>

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
					{#if $signLoading}
						<span
							style="
			width: 100%;
			height: 190px;
			display: flex;
			align-items: center;
			justify-content: center;"
						>
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" style="height: 32px; width: 32px;">
								<path fill="#4c4c4c" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" /></path>
							</svg>
						</span>
					{:else}
						<table bind:this={htmlSignature} transition:fade={{ duration: 200 }} width="600" cellspacing="0" cellpadding="0" border="0" style="padding: 32px 0;font-size:13px;font-weight: 500;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
							<tbody>
								<tr>
									{#if $user.personalInfo.pictureUrl || $isLoading === true}
										<td width="100" style="vertical-align:top;padding:0 1em;">
											<Image isLoading={$isLoading} src={$user.personalInfo.pictureUrl} alt="avatar" style="width: 100px; height: 100px; border-radius: 10px; border:none" />
										</td>
										<td style="border-left:solid #eaecf0 1px" width="16" />
									{/if}
									<td style="vertical-align: top; text-align:left;color:#000000; text-align:left">
										<div style="orphans: 2; widows: 2;">
											<span style="padding-top: 10px; line-height:1; color:#000000;font-size:15px;">
												<b>{$user.personalInfo.name}</b>
											</span>
										</div>
										<div style="orphans: 2; widows: 2;">
											<span style="line-height: 1.8;color:#4C4C4C; font-weight:500;">
												{$user.personalInfo.position} •
												<a href={selectedLink.link} data-external="true" style="text-decoration:none !important;color:#0079fe;font: 600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; !important;">
													<span style="text-decoration:none;color:#0079fe;font-weight: 600 !important;">{selectedLink.name}</span>
												</a>
											</span>
										</div>
										<div style="orphans: 2; widows: 2;">
											<span
												style="color:#8C8C8C; line-height: 1.6; margin: 6px 0; display:inline-block;     font-size: 13px;
									font-weight: 500;"
											>
												68 bis Chem. du Moulin Carron
												<br />
												69570 Dardilly
											</span>
										</div>
										<div style="orphans: 2; widows: 2;">
											{#if $user.features.bookACall}
												<a href={$user.features.bookACall} rel="noreferrer" target="_blank" style="max-width:260px;display: block;padding: .65em 1em;margin: 6px 0;text-align: center;text-decoration:none;color: white;font-weight: bold;border-radius: 6px;background-color: #0079fe;border: 1px solid rgba(0, 0, 0, .1);">Schedule 15 minutes with me</a>
											{/if}
											{#if $user.personalInfo.contact.phone}
												<span style="color:#8C8C8C!important;margin: 6px 0 0;">
													<a href="tel:{$user.personalInfo.contact.phone}" data-external="true" style="text-decoration:none !important;color: rgb(140, 140, 140);">
														<span style="text-decoration: none;color: #4c4c4c; line-height: 1.5;">{$user.personalInfo.contact.phone}</span>
													</a>
													{#if $user.preferences.mobilePhoneCheckbox && $user.personalInfo.contact.mobilePhone.length}
														•
														<a href="tel:{$user.personalInfo.contact.mobilePhone}" data-external="true" style="text-decoration:none !important;color: rgb(140, 140, 140);">
															<span style="text-decoration: none;color: #4c4c4c; line-height: 1.5;">{$user.personalInfo.contact.mobilePhone}</span>
														</a>
													{/if}
												</span>
											{/if}
											{#if $user.personalInfo.contact.email}
												<a href="mailto:{$user.personalInfo.contact.email}" data-external="true" style="display: block; text-decoration:none !important;color: rgb(140, 140, 140);">
													<span style="text-decoration:none;color: rgb(140, 140, 140); line-height: 1.5;">{$user.personalInfo.contact.email}</span>
												</a>
											{/if}
										</div>
										<table cellpadding="0" border="0" style="vertical-align:top; padding-top: 12px; border-collapse: initial; {checkImageUrl($user.features.banner.link) || $user.advert ? 'padding-bottom: 8px;' : ''}">
											<tbody>
												<tr>
													<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
														<a href="https://www.facebook.com/solwareauto/" target="_blank" rel="noreferrer" data-external="true">
															<img width="50%" alt="social icon facebook" style="border:none" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698764174/exe3v7typk2ljoaxlrwu.png" />
														</a>
													</td>
													<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
														<a href="https://www.youtube.com/@solwaregroup" target="_blank" rel="noreferrer" data-external="true">
															<img width="50%" alt="social icon youtube" style="border:none" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698763890/wbuzww8stmff3v26ruvv.png" />
														</a>
													</td>
													<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
														<a href="https://twitter.com/solwareauto" target="_blank" rel="noreferrer" data-external="true">
															<img width="50%" alt="social icon twitter" style="border:none" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698763890/uxuaujbvbwg7bcecxpqq.png" />
														</a>
													</td>
													<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
														<a href={$user.linkedin || "https://www.linkedin.com/company/solware-auto/"} target="_blank" rel="noreferrer" data-external="true">
															<img width="50%" alt="social icon linkedin" style="border:none" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698763890/o86mwkuj02awbnh4nryv.png" />
														</a>
													</td>
												</tr>
											</tbody>
										</table>
										{#if checkImageUrl($user.features.banner.image) && $user.features.banner.visible}
											<a href={$user.features.banner.link ? $user.features.banner.link : null} style="display:block; margin-top: 1em; {$user.features.banner.visible ? 'margin-bottom: 6px;' : ''}">
												<Image srcBanner={$user.features.banner.image} banner="true" alt="bannière d'annonce" style="border-radius:10px;{$user.features.banner.border ? 'border: 1px solid #ddd;' : ''}" />
											</a>
										{/if}
										{#if $user.preferences.advert != 0}
											<span style="font-size: 10px; line-height: 14px; color: #aaa;margin-top: .75em; display: inline-block;">CONFIDENTIALITY NOTICE — {lang[$user.preferences.advert]}</span>
										{/if}
									</td>
								</tr>
							</tbody>
						</table>
					{/if}
				</div>
			</div>
		</div>
		<!-- <img class="circle" src={circle} alt=""> -->
	</div>
{/if}
