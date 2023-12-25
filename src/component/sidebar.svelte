<script>
	import { onMount } from "svelte";
	import user, { updateInlocalStore, resetToDefault, isLoading, signLoading, isHelpOpen } from "$lib/store";
	import { notifications } from "$components/notification";
	import Dropdown from "$components/Dropdown.svelte";
	import Image from "$components/Image.svelte";
	import { InputBase, InputLink } from "$components/Inputs";
	import { tooltip } from "$components/tooltip";
	import { langOptions, brandOptions, txtApp, addressOptions, notificationIcon } from "$lib/constants";
	import { formatPhone, loadImage, checkImageUrl, getBase64, fadeSlide, handleInput } from "$lib/util";
	import { fade } from "svelte/transition";
	import { Svrollbar } from "svrollbar";
	let files,
		fileInput,
		showMore = false;
	let viewport;
	let contents;

	function handleSuccess(e) {
		// notifications.success("Copié dans le presse-papier", 1000);
		e.clearSelection();
	}

	async function selectImage(image, input) {
		if (!image) return;
		const base64 = await getBase64(image);
		updateInlocalStore("features.previewImage", base64);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (!$user.preferences.acceptRgpd) return notifications.info("Condition d'utilisations non acceptées", 5000);
		if (!$user.identifiers.userUniqueToken && !$user.identifiers.userUniqueToken?.length > 0) return notifications.warning("Une erreur est survenu, merci de vider votre cache ou réessayer avec un autre navigateur.", 2000);
		if (!$user.features.previewImage) return notifications.warning("Un avatar est requis", 3000, notificationIcon.warning);
		isLoading.update((current) => !current);

		const uuid = $user.identifiers.userUniqueToken;
		const avatar = $user.features.previewImage;
		const name = $user.personalInfo.name;

		const response = await fetch("api/upload", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ fullname: name, avatar: avatar, token: uuid }),
		});

		if (response.ok) {
			const data = await response.json();
			// if (!data.secure_url) return notifications.danger(data.error, 2000);
			updateInlocalStore("personalInfo.pictureUrl", data.secure_url);
		}
		isLoading.update((current) => false);
	}

	function removeFile() {
		try {
			updateInlocalStore("features.previewImage", null);
			fileInput.value = "";
		} catch (error) {
			notifications.danger(error, 5000, notificationIcon.warning);
		}
	}

	function showHelp() {
		$isHelpOpen = !$isHelpOpen;
	}

	async function handleReset() {
		try {
			await resetToDefault();
			notifications.info("Réinitialisation complète", 1000, notificationIcon.reset);
		} catch (error) {
			notifications.danger(error, 5000, notificationIcon.warning);
		}
	}
</script>

<nav>
	<aside class="sidebar" bind:this={viewport}>
		<div class="content" bind:this={contents}>
			<header>
				<a href="/" class="logo">
					<svg xmlns="http://www.w3.org/2000/svg" data-name="Calque 1" viewBox="0 0 82.43 17.34">
						<path
							d="M23.74 10.96h2.04c.19 1.35 1.01 2.03 2.46 2.03.71 0 1.27-.16 1.68-.48.43-.33.64-.7.64-1.09 0-.72-.53-1.2-1.6-1.46l-2.45-.62c-.88-.23-1.53-.59-1.95-1.08-.42-.5-.62-1.17-.62-2.01 0-1.02.39-1.8 1.17-2.35.79-.55 1.81-.83 3.07-.83 2.65 0 4.08 1.12 4.28 3.35h-2.12c-.05-.49-.28-.89-.67-1.22-.38-.33-.88-.5-1.48-.5-.65 0-1.18.14-1.59.41-.39.27-.59.61-.59 1.01 0 .73.41 1.19 1.22 1.39l2.66.67c.98.24 1.68.61 2.1 1.11.44.49.65 1.12.65 1.89 0 1.06-.43 1.9-1.29 2.52-.86.62-1.92.93-3.18.93s-2.3-.29-3.12-.87c-.82-.58-1.26-1.51-1.32-2.79Zm12.83 1.42c.32.48.77.72 1.34.72s1-.24 1.32-.72c.33-.49.5-1.15.5-1.99s-.17-1.49-.5-1.98c-.33-.49-.77-.73-1.32-.73s-1.01.24-1.34.73-.5 1.15-.5 1.98.17 1.51.5 1.99Zm1.34 2.24c-1.2 0-2.16-.37-2.85-1.11-.69-.75-1.03-1.79-1.03-3.13s.34-2.38 1.03-3.12c.7-.75 1.65-1.12 2.85-1.12s2.13.37 2.82 1.12c.7.74 1.04 1.78 1.04 3.12s-.35 2.38-1.04 3.13c-.69.74-1.63 1.11-2.82 1.11Zm7.56-11.9V14.4h-1.98V2.72h1.98Zm13.91 3.65-2.24 8.04h-2.43l-1.7-6.25-1.71 6.25h-2.43l-2.24-8.04h2.09l1.48 6.11 1.7-6.11h2.24l1.68 6.11 1.48-6.11h2.09Zm7.87 2.87v5.17h-1.84v-1.25c-.49.55-.93.93-1.32 1.15-.39.21-.86.31-1.39.31-.79 0-1.42-.19-1.9-.58-.47-.39-.7-.96-.7-1.68s.21-1.27.64-1.67c.44-.41 1.13-.69 2.07-.86l2.51-.44c0-.65-.13-1.12-.39-1.4-.25-.29-.64-.44-1.18-.44-.91 0-1.42.41-1.53 1.23h-1.89c.05-.88.37-1.54.95-1.98.58-.45 1.38-.67 2.4-.67 1.23 0 2.12.25 2.7.75.58.49.87 1.27.87 2.34Zm-1.93 2.85v-1.54l-2.04.36c-.76.14-1.14.54-1.14 1.22 0 .34.1.61.31.81.22.19.5.28.84.28s.66-.08.95-.23c.29-.17.65-.46 1.08-.89Zm5.99 2.32h-1.98V6.36h1.89v1.48c.29-.52.67-.93 1.14-1.23.48-.31 1.01-.47 1.59-.47v2.09h-.78c-.88 0-1.5.43-1.85 1.28v4.89Zm9.08-2.09h1.92c-.54 1.54-1.74 2.31-3.6 2.31-1.08 0-1.97-.37-2.68-1.11-.7-.73-1.04-1.77-1.04-3.13s.35-2.4 1.04-3.13c.71-.74 1.6-1.11 2.68-1.11s1.97.37 2.68 1.11c.7.73 1.04 1.77 1.04 3.13v.37h-5.44c.06 1.63.7 2.45 1.9 2.45.68 0 1.17-.3 1.5-.89Zm-3.4-2.68h3.43c-.08-.66-.28-1.17-.58-1.53-.29-.36-.67-.55-1.14-.55s-.85.18-1.15.55c-.29.35-.48.86-.56 1.53Z"
						/>
						<path d="M5.42 0C2.43 0 0 2.43 0 5.42v3.27c0 .77.93 1.15 1.46.6 2.57-2.63 6-4.4 9.85-4.85 1.02-.12 1.92.68 1.92 1.71v5.36c0 .8-.65 1.55-1.43 1.69-1.85.34-3.47 1.34-4.62 2.74-.45.56-.05 1.39.67 1.39h4.06c2.99 0 5.42-2.43 5.42-5.42v-6.5c0-2.99-2.43-5.42-5.42-5.42h-6.5Z" style="fill:#34d399;fill-rule:evenodd" />
					</svg>
				</a>
				<button class="btn -secondary -round -extra-small -info" on:click={showHelp}>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M8.99946 4.5C9.16242 4.50003 9.32094 4.55315 9.45103 4.6513C9.58112 4.74945 9.6757 4.8873 9.72046 5.044L10.5335 7.89C10.7085 8.50292 11.0369 9.0611 11.4876 9.51183C11.9384 9.96255 12.4965 10.291 13.1095 10.466L15.9555 11.279C16.1121 11.3239 16.2498 11.4185 16.3478 11.5486C16.4459 11.6786 16.4989 11.8371 16.4989 12C16.4989 12.1629 16.4459 12.3214 16.3478 12.4514C16.2498 12.5815 16.1121 12.6761 15.9555 12.721L13.1095 13.534C12.4965 13.709 11.9384 14.0374 11.4876 14.4882C11.0369 14.9389 10.7085 15.4971 10.5335 16.11L9.72046 18.956C9.6756 19.1126 9.58098 19.2503 9.4509 19.3484C9.32082 19.4464 9.16235 19.4995 8.99946 19.4995C8.83657 19.4995 8.6781 19.4464 8.54802 19.3484C8.41794 19.2503 8.32332 19.1126 8.27846 18.956L7.46546 16.11C7.29041 15.4971 6.96201 14.9389 6.51129 14.4882C6.06056 14.0374 5.50238 13.709 4.88946 13.534L2.04346 12.721C1.88686 12.6761 1.74913 12.5815 1.65108 12.4514C1.55303 12.3214 1.5 12.1629 1.5 12C1.5 11.8371 1.55303 11.6786 1.65108 11.5486C1.74913 11.4185 1.88686 11.3239 2.04346 11.279L4.88946 10.466C5.50238 10.291 6.06056 9.96255 6.51129 9.51183C6.96201 9.0611 7.29041 8.50292 7.46546 7.89L8.27846 5.044C8.32322 4.8873 8.4178 4.74945 8.54789 4.6513C8.67798 4.55315 8.8365 4.50003 8.99946 4.5ZM17.9995 1.5C18.1668 1.49991 18.3293 1.55576 18.4612 1.65869C18.5931 1.76161 18.6869 1.90569 18.7275 2.068L18.9855 3.104C19.2215 4.044 19.9555 4.778 20.8955 5.014L21.9315 5.272C22.0941 5.31228 22.2385 5.40586 22.3418 5.5378C22.445 5.66974 22.5011 5.83246 22.5011 6C22.5011 6.16754 22.445 6.33026 22.3418 6.4622C22.2385 6.59414 22.0941 6.68772 21.9315 6.728L20.8955 6.986C19.9555 7.222 19.2215 7.956 18.9855 8.896L18.7275 9.932C18.6872 10.0946 18.5936 10.2391 18.4617 10.3423C18.3297 10.4456 18.167 10.5017 17.9995 10.5017C17.8319 10.5017 17.6692 10.4456 17.5373 10.3423C17.4053 10.2391 17.3117 10.0946 17.2715 9.932L17.0135 8.896C16.8981 8.43443 16.6594 8.0129 16.323 7.67648C15.9866 7.34005 15.565 7.10139 15.1035 6.986L14.0675 6.728C13.9048 6.68772 13.7604 6.59414 13.6571 6.4622C13.5539 6.33026 13.4978 6.16754 13.4978 6C13.4978 5.83246 13.5539 5.66974 13.6571 5.5378C13.7604 5.40586 13.9048 5.31228 14.0675 5.272L15.1035 5.014C15.565 4.89861 15.9866 4.65995 16.323 4.32352C16.6594 3.9871 16.8981 3.56557 17.0135 3.104L17.2715 2.068C17.3121 1.90569 17.4058 1.76161 17.5377 1.65869C17.6696 1.55576 17.8321 1.49991 17.9995 1.5ZM16.4995 15C16.657 14.9999 16.8105 15.0494 16.9383 15.1415C17.0661 15.2336 17.1617 15.3636 17.2115 15.513L17.6055 16.696C17.7555 17.143 18.1055 17.495 18.5535 17.644L19.7365 18.039C19.8854 18.089 20.0149 18.1845 20.1067 18.3121C20.1984 18.4397 20.2478 18.5929 20.2478 18.75C20.2478 18.9071 20.1984 19.0603 20.1067 19.1879C20.0149 19.3155 19.8854 19.411 19.7365 19.461L18.5535 19.856C18.1065 20.006 17.7545 20.356 17.6055 20.804L17.2105 21.987C17.1604 22.136 17.0649 22.2655 16.9373 22.3572C16.8098 22.4489 16.6566 22.4983 16.4995 22.4983C16.3423 22.4983 16.1892 22.4489 16.0616 22.3572C15.934 22.2655 15.8385 22.136 15.7885 21.987L15.3935 20.804C15.3198 20.5833 15.1958 20.3827 15.0313 20.2182C14.8667 20.0537 14.6662 19.9297 14.4455 19.856L13.2625 19.461C13.1135 19.411 12.984 19.3155 12.8923 19.1879C12.8005 19.0603 12.7512 18.9071 12.7512 18.75C12.7512 18.5929 12.8005 18.4397 12.8923 18.3121C12.984 18.1845 13.1135 18.089 13.2625 18.039L14.4455 17.644C14.8925 17.494 15.2445 17.144 15.3935 16.696L15.7885 15.513C15.8382 15.3637 15.9336 15.2339 16.0612 15.1418C16.1888 15.0497 16.3421 15.0001 16.4995 15Z"
							fill="#34D399"
						/>
					</svg>
					<b>Infos</b>
					<!-- <svg width="2" height="2" aria-hidden="true" class="fill-slate-900"><circle cx="1" cy="1" r="1" /></svg
					<span>Mise à jour</span> -->
				</button>
			</header>
			<div class="field">
				<label for="avatar">Avatar</label>
				<div class="input-file {$user.personalInfo.pictureUrl ? 'active' : ''}">
					<div class="avatar-selection">
						<input tabindex="-1" id="avatar" name="avatar" bind:files type="file" accept=".png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.jfif,.pjpeg,.pjp,.avif" bind:this={fileInput} on:change={(e) => selectImage(files[0], e.target)} />
						<div class="avatar">
							{#if $user.features.previewImage}
								<img transition:fade={{ duration: 100 }} class="avatar-preview" src={$user.features.previewImage} alt={`Picture of ${$user.personalInfo.name}`} />
								<button transition:fade={{ duration: 100 }} use:tooltip title="Retirer" class="btn -imagepreview" on:click={removeFile}>
									<svg viewBox="0 0 382 382" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M236.2 191L372.6 54.6C385 42.2 385 21.8 372.6 9.39997C360.2 -3.00002 339.8 -3.00002 327.4 9.39997L191 145.8L54.6 9.39997C42.2 -3.00002 21.8 -3.00002 9.39999 9.39997C3.19999 15.6 0 23.8 0 32C0 40.2 3.19999 48.4 9.39999 54.6L145.8 191L9.39999 327.4C3.19999 333.6 0 341.8 0 350C0 358.2 3.19999 366.4 9.39999 372.6C21.8 385 42.2 385 54.6 372.6L191 236.2L327.4 372.6C339.8 385 360.2 385 372.6 372.6C385 360.2 385 339.8 372.6 327.4L236.2 191Z"
										/>
									</svg>
								</button>
							{:else}
								<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path
										fill-rule="evenodd"
										d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</div>
						<button for="avatar" class="btn -secondary" type="button" on:click={() => fileInput.click()}>Changer</button>
					</div>
				</div>
			</div>
			<div class="field">
				<InputBase type="text" label="Prénom et nom" placeholder="Prénom et nom" id="name" inputHandler={(newValue) => handleInput(newValue, "personalInfo.name")} value={$user.personalInfo.name} />
			</div>
			<div class="field">
				<InputBase type="text" label="Poste occupé" spellcheck="false" placeholder="Poste" id="poste" inputHandler={(newValue) => handleInput(newValue, "personalInfo.position")} value={$user.personalInfo.position} />
			</div>
			<div class="field">
				<Dropdown opts={brandOptions} obj="preferences.brand" label="Entité" id="entity" />
			</div>
			<div class="field">
				<Dropdown opts={addressOptions} obj="preferences.address" label="Adresse du siège" id="address"/>
			</div>
			<div class="field">
				<label for="phone">Téléphone entreprise</label>
				<!-- <input
					type="tel"
					size="10"
					placeholder="Numéro téléphone"
					id="phone"
					on:input={(event) => {
						formatPhone(event, (newValue) =>
							user.update((currUser) => {
								return {
									...currUser,
									personalInfo: {
										...currUser.personalInfo,
										contact: {
											...currUser.personalInfo.contact,
											phone: newValue,
										},
									},
								};
							})
						);
					}}
					value={$user.personalInfo.contact.phone}
				/> -->
				<InputBase type="tel" placeholder="Numéro téléphone" id="phone" inputHandler={(newValue) => handleInput(newValue, "personalInfo.contact.phone")} value={$user.personalInfo.contact.phone} formatFunction={formatPhone} />
			</div>
			<div class="field">
				<div class="field -inline">
					<label for="phoneMobileCheck">Téléphone mobile</label>
					<input id="phoneMobileCheck" bind:checked={$user.preferences.mobilePhoneCheckbox} type="checkbox" class="checkbox switch" />
				</div>
				{#if $user.preferences.mobilePhoneCheckbox}
					<InputBase type="tel" placeholder="Numéro téléphone" id="phone" inputHandler={(newValue) => handleInput(newValue, "personalInfo.contact.mobilePhone")} value={$user.personalInfo.contact.mobilePhone} formatFunction={formatPhone} />
				{/if}
			</div>
			<div class="field">
				<label for="email">Email</label>
				<input type="email" id="email" placeholder="Votre email" bind:value={$user.personalInfo.contact.email} />
			</div>
			<!-- <div class="separator" /> -->
			<div class="divider-title">
				<div class="line-container"><div class="line" /></div>
				<div class="title">
					<button class="btn -round -secondary" on:click={() => (showMore = !showMore)}>
						{showMore ? "Voir moins" : "Voir plus"}
					</button>
				</div>
			</div>
			{#if showMore}
				<div transition:fadeSlide={{ duration: 180 }} class="more">
					<div class="field">
						<InputLink label="LinkedIn personnel" placeholder="www.linkedin.com/in/" id="linkedin" inputHandler={(newValue) => handleInput(newValue, "personalInfo.contact.linkedin")} value={$user.personalInfo.contact.linkedin} />
						<!-- <input type="text" spellcheck="false" autocomplete="off" id="linkedin" placeholder="Lien de votre LinkedIn" bind:value={$user.personalInfo.contact.linkedin} /> -->
					</div>
					<div class="field">
						<InputLink label="Réserver un appel" placeholder="www.calendar.google.com/calendar" id="BookACall" inputHandler={(newValue) => handleInput(newValue, "features.bookACall")} value={$user.features.bookACall} />
						<!-- <input type="text" placeholder="Lien du calendrier enw ligne" id="BookACall" bind:value={$user.features.bookACall} /> -->
					</div>
					<!-- <fieldset class="field fieldset">
						<div class="field">
							<label for="uploadBanner">
								Bannière d'annonce
								<svg use:tooltip title="Image au format .jpg, .jpeg, .png" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clip-path="url(#clip0_1054_159)">
										<path
											d="M6.05998 5.99998C6.21672 5.55442 6.52608 5.17872 6.93328 4.9394C7.34048 4.70009 7.81924 4.61261 8.28476 4.69245C8.75028 4.7723 9.17252 5.01433 9.4767 5.37567C9.78087 5.737 9.94735 6.19433 9.94665 6.66665C9.94665 7.99998 7.94665 8.66665 7.94665 8.66665M7.99998 11.3333H8.00665M14.6666 7.99998C14.6666 11.6819 11.6819 14.6666 7.99998 14.6666C4.31808 14.6666 1.33331 11.6819 1.33331 7.99998C1.33331 4.31808 4.31808 1.33331 7.99998 1.33331C11.6819 1.33331 14.6666 4.31808 14.6666 7.99998Z"
											stroke="#98A2B3"
											stroke-width="1.33333"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</g>
									<defs>
										<clipPath id="clip0_1054_159">
											<rect width="16" height="16" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</label>
							<div class="inline-btn">
								<button
									use:tooltip
									title="Afficher ou cacher l'annonce"
									class="btn -secondary -square in-input"
									on:click={() => {
										$user.features.banner.visible = !$user.features.banner.visible;
									}}
								>
									{#if $user.features.banner.visible}
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
											/>
										</svg>
									{/if}
								</button>
								<input type="text" spellcheck="false" autocomplete="off" bind:value={$user.features.banner.image} placeholder="Lien de l'image de votre bannière" />
							</div>
						</div>
						<div class="field">
							<label for="bannerLink">Lien internet de l'annonce</label>
							<input type="text" disabled={!$user.features.banner.image} bind:value={$user.features.banner.link} id="bannerLink" placeholder="Lien d'annonce" />
						</div>
						<div class="field -inline">
							<label for="border">Contour</label>
							<input disabled={!$user.features.banner.image} id="border" bind:checked={$user.features.banner.border} type="checkbox" class="checkbox switch" />
						</div>
					</fieldset> -->
					<div class="field">
						<Dropdown opts={langOptions} obj="preferences.advert" id="advert" label="Avertissement de confidentialité"/>
					</div>
				</div>
			{/if}
			<footer>
				<div class="buttons-group">
					<div class="field -inline -rgpd" use:tooltip title={txtApp.infosRgpd}>
						<input bind:checked={$user.preferences.acceptRgpd} id="rgpd" type="checkbox" />
						<label for="rgpd">{txtApp.checkboxRgpd}</label>
					</div>
					<button class="btn -primary" disabled={!$user.preferences.acceptRgpd} on:click={handleSubmit}>Créer la signature</button>
					<div class="inline-btn">
						<button on:click={handleReset} class="copyToClipboard btn -secondary" type="button">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
							</svg>
							Réinitialiser
						</button>
					</div>
				</div>
				<!-- <a href="https://teams.microsoft.com/l/chat/0/0?users=abelkic@solware.fr" class="btn -secondary">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
							</svg>
							Me contacter
						</a> -->
			</footer>
		</div>
	</aside>
	<Svrollbar {viewport} {contents} />
</nav>
