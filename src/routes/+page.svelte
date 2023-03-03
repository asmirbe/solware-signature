<script>
	// Importing scss file and svelte store, component and library
	import "../scss/main.scss";
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from "svelte";
	import user, {deleteFromlocalStore, resetToDefault} from "../store.js";
	import {notifications} from "../component/notifications.js";
	import Notification from "../component/notification.svelte";
	// import Dropdown from "../component/dropdown.svelte";
	import { accordion } from "../component/accordion.js";
	import Tooltip from "../component/tooltip.svelte";
	import ClipboardJS from "clipboard";
	import Image from "../component/image.svelte";
	import { fade } from 'svelte/transition';

	// Variables
	let active = false,
	localStore,
	files,
	fileInput,
	signLoading = true,
	imagesLoded = false,
	showMore = false,
	clipboard,
	isLoading = false;

	function loadImage(img, onLoad, onError) {
    img.onload = () => {
      onLoad(img);
			console.log('Image loaded!');
    };
    img.onerror = () => {
      onError(img);
    };
    img.src = img.dataset.src;
  }

	onMount(async () => {
		localStore = localStorage.getItem("user") ? true : false;
		localStorage ? signLoading = false : signLoading = true;
		const images = document.querySelectorAll('img[data-src]');
		images.forEach((img) => {
      loadImage(
        img,
        (loadedImg) => {
          loadedImg.removeAttribute('data-src');
        },
        () => {
          console.log(`Error loading image: ${img.dataset.src}`);
        }
      );
    });
		clipboard = new ClipboardJS(".btn");
		clipboard.on("success", function (e) {
			notifications.success("Copié dans le presse-papier", 1000);
			e.clearSelection();
		});

		// capture ctrl+s
		document.addEventListener("keydown", function (e) {
			if (e.ctrlKey && e.keyCode == 83) {
				e.preventDefault();
				saveData();
			}
		});
	});

	onDestroy(() => {
		if (clipboard) {
			clipboard.destroy();
		}
	});

	// Save data to local storage
	const asyncLocalStorage = {
		setItem: function (key, value) {
			return Promise.resolve().then(function () {
				localStorage.setItem(key, value);
			});
		},
		removeItem: function (key) {
			return Promise.resolve().then(function () {
				localStorage.removeItem(key);
			});
		},
	};

	//  save data to local storage
	function saveData() {
		asyncLocalStorage.setItem("user", JSON.stringify($user)).then(() => {
			localStore = true;
			notifications.success('Profil sauvegardé', 1000)
		});
	}

	// delete data from local storage
	function removeUser() {
		asyncLocalStorage.removeItem("user").then(() => {
			localStore = false;
			notifications.success('Profil supprimé', 1000)
		});
		resetToDefault();
	}

	// get base64 from image
	function getBase64(image) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	// upload image
	async function uploadFunction(image) {
		if (!image) return;
		isLoading = true;
		const data = {};
		data["image"] = await getBase64(image);
		try {
			const res = await fetch(`/api/upload`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(data),
			});
			const responseJson = await res.json();
			$user.pictureUrl = responseJson.secure_url;
			isLoading = false;
			return responseJson.secure_url;
		} catch (error) {
			console.log(error);
		}
	}
	function checkImageUrl(url) {
    const validFormats = ['jpeg', 'jpg', 'gif', 'png', 'webp', 'bmp', 'tiff'];
    const pattern = new RegExp(`^https?://.+\\.(${validFormats.join('|')})$`, 'i');
    return pattern.test(url);
  }
</script>

<svelte:head>
	<title>Ma signature Solware</title>
</svelte:head>

<aside class="form-container">
	<div class="logo">
		<svg width="535" height="54" viewBox="0 0 535 54" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M400.949 13.9581C405.556 13.9581 409.012 15.4022 411.315 18.2905C413.619 21.1788 414.771 25.183 414.771 30.3031V52.9497H404.532V31.2877C404.532 26.0363 402.165 23.4106 397.429 23.4106C394.955 23.4106 392.971 24.1327 391.478 25.5768C389.985 27.021 389.239 28.9027 389.239 31.2221V52.9497H379V15.0084H388.983L388.955 22.6926C391.728 18.7103 395.744 13.9581 400.949 13.9581Z" fill="#0E4BEF"/>
			<path d="M459.201 33.257V36.8017H431.557C432.324 42.3594 435.311 45.1383 440.515 45.1383C445.08 45.1383 448.194 43.3003 449.858 39.6243L458.561 41.9874C457.452 45.7509 455.255 48.7048 451.97 50.8492C448.728 52.9497 444.845 54 440.323 54C434.436 54 429.808 52.1839 426.437 48.5517C423.067 44.9195 421.382 40.1057 421.382 34.1103C421.382 28.2025 423.174 23.3669 426.757 19.6034C430.383 15.8399 435.097 13.9581 440.899 13.9581C446.829 13.9581 451.351 15.7742 454.465 19.4064C457.622 23.0386 459.201 27.6555 459.201 33.257ZM440.451 22.2947C438.062 22.2947 436.036 22.9949 434.372 24.3953C432.751 25.7956 431.791 27.6774 431.493 30.0405H449.218C448.877 27.5899 447.96 25.6862 446.466 24.3296C445.016 22.973 443.011 22.2947 440.451 22.2947Z" fill="#0E4BEF"/>
			<path d="M486.687 33.6508L500.061 52.9497H488.159L483.999 46.4511C482.762 44.4381 481.397 42.1844 479.904 39.6899C478.325 42.5782 477.046 44.7882 476.064 46.3198L471.969 52.9497H460.387L473.505 33.5852L460.77 15.0084H472.737L476.384 20.7849C477.024 21.7914 477.835 23.1699 478.816 24.9204C479.84 26.6709 480.416 27.6336 480.544 27.8087C481.738 25.4455 483.061 23.1043 484.511 20.7849L488.159 15.0084H499.677L486.687 33.6508Z" fill="#0E4BEF"/>
			<path d="M526.681 40.9372L535 43.6285C533.294 50.5428 528.58 54 520.858 54C516.549 54 513.2 52.7528 510.811 50.2584C508.422 47.7202 507.228 44.1755 507.228 39.6243V24.0014H501.789V15.0084H507.804V7H517.466V15.0084H532.312V24.0014H517.466V39.5587C517.466 41.2216 517.829 42.5126 518.554 43.4316C519.322 44.3506 520.389 44.8101 521.754 44.8101C524.228 44.8101 525.871 43.5191 526.681 40.9372Z" fill="#0E4BEF"/>
			<path d="M353.492 3.02999L343.779 4.87626C343.419 4.94464 343.113 5.15935 342.921 5.4739L331.593 24.3687C331.095 25.1961 329.899 25.1961 329.41 24.3687L318.086 5.46569C317.903 5.15115 317.589 4.9378 317.229 4.86805L307.516 3.02316C306.635 2.85494 305.86 3.629 306.03 4.50837L307.877 14.2266C307.945 14.5862 308.16 14.8926 308.474 15.084L327.38 26.4037C328.207 26.9015 328.207 28.0968 327.38 28.5864L308.466 39.9142C308.152 40.0975 307.938 40.4121 307.868 40.7717L306.023 50.4913C305.855 51.372 306.629 52.1461 307.509 51.9765L317.229 50.1302C317.589 50.0619 317.895 49.8471 318.086 49.5326L329.408 30.631C329.906 29.8036 331.102 29.8036 331.591 30.631L342.92 49.5326C343.103 49.8471 343.418 50.0605 343.778 50.1302L353.491 51.9765C354.372 52.1447 355.146 51.3707 354.976 50.4913L353.13 40.7731C353.061 40.4134 352.847 40.1071 352.532 39.9156L333.634 28.5891C332.806 28.0913 332.806 26.896 333.634 26.4064L352.531 15.0799C352.845 14.8967 353.059 14.5821 353.129 14.2225L354.975 4.50427C355.143 3.63858 354.371 2.86588 353.49 3.0341L353.492 3.02999Z" fill="#0E4BEF"/>
			<path d="M18.7099 54C8.24125 54 2.00463 50.1838 0 42.5515L9.82268 40.5662C10.7582 44.0074 13.8097 45.7279 18.9771 45.7279C24.0555 45.7279 26.5947 44.4926 26.5947 42.0221C26.5947 40.8309 25.9711 39.9044 24.7237 39.2426C23.521 38.5809 22.0064 38.1618 20.1799 37.9853C18.3535 37.8088 16.3711 37.5 14.2329 37.0588C12.1391 36.6177 10.1791 36.0882 8.35262 35.4706C6.52618 34.8088 4.9893 33.6397 3.74197 31.9632C2.5392 30.2426 1.93781 28.0809 1.93781 25.4779C1.93781 22.0809 3.45241 19.2574 6.48163 17.0074C9.55539 14.7574 13.6983 13.6324 18.9103 13.6324C23.6323 13.6324 27.4634 14.6029 30.4035 16.5441C33.3882 18.4853 35.3483 21.2426 36.2838 24.8162L26.4611 27C26.1047 25.4559 25.1915 24.2206 23.7214 23.2941C22.2959 22.3676 20.4918 21.9044 18.3089 21.9044C14.166 21.9044 12.0946 23.0074 12.0946 25.2132C12.0946 26.5368 12.941 27.5074 14.6338 28.125C16.3711 28.6985 18.4426 29.1397 20.8481 29.4485C23.2982 29.7132 25.7261 30.1544 28.1316 30.7721C30.5817 31.3456 32.6532 32.5588 34.346 34.4118C36.0833 36.2206 36.952 38.6691 36.952 41.7574C36.952 45.5074 35.326 48.4853 32.074 50.6912C28.8666 52.8971 24.4119 54 18.7099 54Z" fill="#0E4BEF"/>
			<path d="M76.9406 48.5074C73.065 52.1691 68.1203 54 62.1064 54C56.0925 54 51.1478 52.1691 47.2722 48.5074C43.3965 44.8015 41.4587 39.9044 41.4587 33.8162C41.4587 27.7279 43.3965 22.8529 47.2722 19.1912C51.1923 15.4853 56.1593 13.6324 62.1732 13.6324C68.1871 13.6324 73.1319 15.4853 77.0075 19.1912C80.8831 22.8529 82.8209 27.7279 82.8209 33.8162C82.8209 39.9044 80.8608 44.8015 76.9406 48.5074ZM62.1732 44.2721C65.1579 44.2721 67.5412 43.3235 69.3231 41.4265C71.105 39.4853 71.9959 36.9485 71.9959 33.8162C71.9959 30.6838 71.105 28.1691 69.3231 26.2721C67.5412 24.3309 65.1579 23.3603 62.1732 23.3603C59.144 23.3603 56.7385 24.3309 54.9566 26.2721C53.1747 28.1691 52.2837 30.6838 52.2837 33.8162C52.2837 36.9485 53.1747 39.4853 54.9566 41.4265C56.7385 43.3235 59.144 44.2721 62.1732 44.2721Z" fill="#0E4BEF"/>
			<path d="M89.6032 52.9412V0H100.295V52.9412H89.6032Z" fill="#0E4BEF"/>
			<path d="M156.823 14.6912H168.183L153.816 52.9412H143.927L140.185 41.0956C139.205 37.9632 137.868 33.3971 136.175 27.3971C134.438 34.0147 133.213 38.5809 132.5 41.0956L129.092 52.9412H119.136L104.903 14.6912H116.53L120.472 27.4632C121.631 31.2132 122.833 35.6912 124.081 40.8971C125.462 35.0294 126.598 30.5515 127.489 27.4632L131.297 14.6912H141.788L145.597 27.4632C146.488 30.5515 147.669 35.1397 149.139 41.2279C149.985 37.3456 151.21 32.7574 152.814 27.4632L156.823 14.6912Z" fill="#0E4BEF"/>
			<path d="M188.728 13.6324C194.698 13.6324 199.175 15.0441 202.159 17.8676C205.144 20.6471 206.636 24.5294 206.636 29.5147V52.9412H198.15L196.279 48.1765C193.295 52.0588 188.706 54 182.514 54C178.416 54 175.208 52.9191 172.892 50.7574C170.62 48.5515 169.484 45.7279 169.484 42.2868C169.484 38.9338 170.731 36.1324 173.226 33.8824C175.721 31.5882 179.685 30.4412 185.12 30.4412C189.085 30.4412 192.693 31.0147 195.945 32.1618V30.1103C195.945 27.6397 195.255 25.7868 193.874 24.5515C192.493 23.3162 190.577 22.6985 188.127 22.6985C184.251 22.6985 181.846 24.5074 180.91 28.125L170.887 25.6765C173.025 17.6471 178.973 13.6324 188.728 13.6324ZM186.056 45.5956C188.417 45.5956 190.644 44.9559 192.738 43.6765C194.831 42.3971 195.901 40.6544 195.945 38.4485C193.139 37.6103 190.198 37.1912 187.125 37.1912C182.447 37.1912 180.109 38.625 180.109 41.4926C180.109 44.2279 182.091 45.5956 186.056 45.5956Z" fill="#0E4BEF"/>
			<path d="M237.537 13.6324C238.74 13.6324 239.92 13.7647 241.078 14.0294L240.076 23.8235C238.695 23.4706 237.114 23.2941 235.332 23.2941C232.614 23.2941 230.365 24.1765 228.583 25.9412C226.801 27.6618 225.91 30.1324 225.91 33.3529V52.9412H215.219V14.6912H225.71V24.5577C226.565 17.5781 232.236 13.6324 237.537 13.6324Z" fill="#0E4BEF"/>
			<path d="M282 33.0882V36.6618H253.133C253.935 42.2647 257.054 45.0662 262.488 45.0662C267.255 45.0662 270.507 43.2132 272.244 39.5074L281.332 41.8897C280.174 45.6838 277.879 48.6618 274.449 50.8235C271.064 52.9412 267.01 54 262.288 54C256.14 54 251.307 52.1691 247.788 48.5074C244.268 44.8456 242.509 39.9927 242.509 33.9485C242.509 27.9926 244.38 23.1176 248.122 19.3235C251.908 15.5294 256.831 13.6324 262.889 13.6324C269.081 13.6324 273.803 15.4632 277.055 19.125C280.352 22.7868 282 27.4412 282 33.0882ZM262.421 22.0368C259.927 22.0368 257.811 22.2256 256.073 23.6374C254.381 25.0492 253.378 26.9462 253.067 29.3286L271.576 29.8456C271.22 27.375 270.262 25.4559 268.703 24.0882C267.188 22.7206 265.094 22.0368 262.421 22.0368Z" fill="#0E4BEF"/>
			</svg>

	</div>
	<div class="content">
		<h1>Générateur de signature</h1>
		<div class="field">
			<label for="name">Prénom et Nom</label>
			<input type="text" spellcheck="false" autocomplete="off" id="name" placeholder="Prénom et nom" bind:value={$user.name} />
		</div>
		<div class="field">
			<label for="uploadFile">Image</label>
			<div class="input-file {$user.pictureUrl ? 'active' : ''}">
				<input
					tabindex="-1"
					id="uploadFile"
					type="file"
					bind:files
					accept=".png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.jfif,.pjpeg,.pjp,.avif"
					bind:this={fileInput}
					on:change={() => uploadFunction(files[0])}
				/>
				<div class="inline-btn">
				<button for="uploadFile" class="btn -secondary" on:click={() => fileInput.click()}>{$user.pictureUrl ? "Remplacer" : "Choisir"}</button>
				{#if $user.pictureUrl}
				<button class="btn -secondary -remove -square" on:click={
					() => {
						notifications.success('Image supprimé, pensez a sauvegarder', 1000)
						deleteFromlocalStore("pictureUrl");
					}
				}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
					</svg>
				</button>
				{/if}
			</div>
			</div>
		</div>
		<div class="field">
			<label for="position">Poste occupé</label>
			<input type="text" spellcheck="false" autocomplete="off" id="position" placeholder="Poste occupé" bind:value={$user.position} />
		</div>
		<div class="field">
			<label for="email">Email</label>
			<input type="email" id="email" placeholder="Votre email" bind:value={$user.email} />
		</div>
		<div class="field">
			<label for="phone">Téléphone</label>
			<input
				type="tel"
				pattern="^9[0-9]{7}"
				size="10"
				placeholder="Numéro téléphone"
				id="phone"
				bind:value={$user.phone}
			/>
		</div>
		<!-- Relative -->
		<div>
			<div class="separator" />
			<div use:accordion={showMore}  class="more {showMore ? '' : 'hidden'}">
				<h2>Plus d'options</h2>
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<div class="field">
						<label for="linkedin">LinkedIn personnel</label>
						<input type="text" spellcheck="false" autocomplete="off" id="linkedin" placeholder="Lien de votre LinkedIn" bind:value={$user.linkedin} />
					</div>
					<fieldset class="field fieldset">
						<div class="field">
							<label for="uploadBanner">Bannière d'annonce <Tooltip text="Image au format .jpg, .jpeg, .png">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clip-path="url(#clip0_1054_159)">
									<path d="M6.05998 5.99998C6.21672 5.55442 6.52608 5.17872 6.93328 4.9394C7.34048 4.70009 7.81924 4.61261 8.28476 4.69245C8.75028 4.7723 9.17252 5.01433 9.4767 5.37567C9.78087 5.737 9.94735 6.19433 9.94665 6.66665C9.94665 7.99998 7.94665 8.66665 7.94665 8.66665M7.99998 11.3333H8.00665M14.6666 7.99998C14.6666 11.6819 11.6819 14.6666 7.99998 14.6666C4.31808 14.6666 1.33331 11.6819 1.33331 7.99998C1.33331 4.31808 4.31808 1.33331 7.99998 1.33331C11.6819 1.33331 14.6666 4.31808 14.6666 7.99998Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
									</g>
									<defs>
									<clipPath id="clip0_1054_159">
									<rect width="16" height="16" fill="white"/>
									</clipPath>
									</defs>
								</svg>
							</Tooltip>
							</label>
							<input type="text" spellcheck="false" autocomplete="off" bind:value={$user.banner} placeholder="Lien de l'image de votre bannière">
						</div>
						<div class="field">
							<label for="bannerLink">Lien internet de l'annonce</label>
							<input type="text" disabled={!$user.banner} bind:value={$user.bannerLink} id="bannerLink" placeholder="Lien d'annonce">
						</div>
						<div class="field -inline">
							<label for="border">Contour</label><input disabled={!$user.banner} id="border" bind:checked={$user.border} type="checkbox" class="checkbox switch">
						</div>
					</fieldset>
					<div class="field -inline">
						<label for="advert">Avertissement de sécurité</label><input id="advert" bind:checked={$user.advert} type="checkbox" class="checkbox switch">
					</div>
			</div>
			<footer>
				<div class="buttons-group">
					<button
						on:click={() => {
							showMore = !showMore;
						}}
						class="copyToClipboard btn -secondary"
						type="button"
					>
					<svg viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M3.5 6H13.5M1 1H16M6 11H11" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						{showMore ? "Moins d'options" : "Plus d'options"}
					</button>
					<button
						class="copyToClipboard btn -primary"
						type="button"
						data-clipboard-target=".sign-content"
					>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M7.5 3H14.6C16.8402 3 17.9603 3 18.816 3.43597C19.5686 3.81947 20.1805 4.43139 20.564 5.18404C21 6.03969 21 7.15979 21 9.4V16.5M6.2 21H14.3C15.4201 21 15.9802 21 16.408 20.782C16.7843 20.5903 17.0903 20.2843 17.282 19.908C17.5 19.4802 17.5 18.9201 17.5 17.8V9.7C17.5 8.57989 17.5 8.01984 17.282 7.59202C17.0903 7.21569 16.7843 6.90973 16.408 6.71799C15.9802 6.5 15.4201 6.5 14.3 6.5H6.2C5.0799 6.5 4.51984 6.5 4.09202 6.71799C3.71569 6.90973 3.40973 7.21569 3.21799 7.59202C3 8.01984 3 8.57989 3 9.7V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						Copier
					</button>
					<div class="inline-btn">
						<button
							on:click={saveData}
							class="copyToClipboard btn -secondary"
							type="button"
						>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M7 3V6.4C7 6.96005 7 7.24008 7.10899 7.45399C7.20487 7.64215 7.35785 7.79513 7.54601 7.89101C7.75992 8 8.03995 8 8.6 8H15.4C15.9601 8 16.2401 8 16.454 7.89101C16.6422 7.79513 16.7951 7.64215 16.891 7.45399C17 7.24008 17 6.96005 17 6.4V4M17 21V14.6C17 14.0399 17 13.7599 16.891 13.546C16.7951 13.3578 16.6422 13.2049 16.454 13.109C16.2401 13 15.9601 13 15.4 13H8.6C8.03995 13 7.75992 13 7.54601 13.109C7.35785 13.2049 7.20487 13.3578 7.10899 13.546C7 13.7599 7 14.0399 7 14.6V21M21 9.32548V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H14.6745C15.1637 3 15.4083 3 15.6385 3.05526C15.8425 3.10425 16.0376 3.18506 16.2166 3.29472C16.4184 3.4184 16.5914 3.59135 16.9373 3.93726L20.0627 7.06274C20.4086 7.40865 20.5816 7.5816 20.7053 7.78343C20.8149 7.96237 20.8957 8.15746 20.9447 8.36154C21 8.59171 21 8.8363 21 9.32548Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>Enregistrer
						</button>
						{#if localStore}
							<button class="btn -secondary -remove -square" on:click={removeUser}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</button>
						{/if}
					</div>
				</div>
				<div class="desc">
					<p>
						Veuillez remplir les informations demandées et coller le contenu dans l'espace <span
							class="outlook"
							on:mouseenter={() => {
								active = true;
							}}
							on:mouseleave={() => {
								active = false;
							}}
						><img
								style={active ? "opacity:1;" : ""}
								src="./outlook.png"
								alt=""
							/><u>de signature électronique</u>
						</span>
						 d'Outlook.
					</p>
					<p>
						Ce site a été créé par Asmir Belkic pour Solware. Si vous avez des questions ou une demande, n'hésitez pas à me contacter par Teams.
					</p>
					<a
						href="https://teams.microsoft.com/l/chat/0/0?users=abelkic@solware.fr"
						class="btn -secondary -teams"><img src="./teams.svg" alt="teams">
						Me contacter
					</a>
				</div>
			</footer>
		</div>
	</div>
</aside>
<Notification />
<div class="preview-container">
	<div class="sign">
		<header class="sign-header">Votre signature</header>
		<div class="sign-content">
			{#if signLoading}
			<span style="
			width: 100%;
			height: 190px;
			display: flex;
			align-items: center;
			justify-content: center;">
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" style="height: 32px; width: 32px;"><path fill="#4c4c4c" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg>
			</span>
			{:else}
				<style type="text/css">
					@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');
					table, tbody, tr, td {
						font-family: Roboto, 'Segoe UI', sans-serif;
						font-weight: 400;
					}
				</style>
				<table
				transition:fade={{duration: 200}}
				width="600"
				cellspacing="0"
				cellpadding="0"
				border="0"
				style="border-collapse: initial; padding: 32px 0; font-size:13px;">
				<tbody>
					<tr>
						{#if $user.pictureUrl}
							<td width="100" style="vertical-align:top;padding:0 16px;">
								<Image isLoading={isLoading} src={$user.pictureUrl} alt="avatar" style="border-radius: 10px;border:none" />
							</td>
							<td style="border-left:solid #eaecf0 1px" width="16" />
						{/if}
						<td
							style="vertical-align: top; text-align:left;color:#000000; text-align:left">
							<span
								style="display: block; padding-top: 10px; line-height:0;color:#000000;font-size:15px; font-weight: bold;">
								{$user.name}
							</span>
							<br />
							<span style="margin-bottom:16px;color:#4C4C4C; display:block;">
								{$user.position} @
								<a
									href="https://www.solware.fr/"
									data-external="true"
									style="text-decoration:none;color:#2E90FA;font-weight: 500;"
								>
									Solware
								</a>
							</span>
							<!-- tel -->
							{#if $user.phone}
							<span style="color:#8C8C8C;display:block;margin-bottom: 3px;">
								{$user.phone}
							</span>
							{/if}
							{#if $user.email}
								<span style="color: rgb(140, 140, 140);display: block;margin-bottom: 6px;">
									{$user.email}
								</span>
							{/if}
							<span style="color:#8C8C8C;">
								68 Bis Chemin du Moulin Carron
								<br />
								Dardilly, France 69570
							</span>
							<br />
							<table
								cellpadding="0"
								border="0"
								style="vertical-align:top; padding-top: 16px; border-collapse: initial; {checkImageUrl($user.banner) || $user.advert ? "padding-bottom: 12px;" : ""}"
							>
								<tbody>
									<tr>
										<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
											<a href="https://www.facebook.com/solwareauto/" target="_blank" rel="noreferrer" data-external="true">
												<img
													width="50%"
													alt="social icon facebook"
													style="border:none"
													src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1677339672/facebook_xgpb61.png"
												/>
											</a>
										</td>
										<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
											<a href="https://www.youtube.com/@solwaregroup" target="_blank" rel="noreferrer" data-external="true">
												<img
													width="50%"
													alt="social icon youtube"
													style="border:none"
													src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1677339672/youtube_i7c6hz.png"
												/>
											</a>
										</td>
										<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
											<a href="https://twitter.com/solwareauto" target="_blank" rel="noreferrer" data-external="true">
												<img
													width="50%"
													alt="social icon twitter"
													style="border:none"
													src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1677339672/icn-twitter_l8u1ob.png"
												/>
											</a>
										</td>
										<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
											<a href={$user.linkedin || "https://www.linkedin.com/company/solware-group/"} target="_blank" rel="noreferrer" data-external="true">
												<img
													width="50%"
													alt="social icon linkedin"
													style="border:none"
													src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1677339672/icn-linkedin_dotpm5.png"
												/>
											</a>
										</td>
									</tr>
								</tbody>
							</table>
							{#if checkImageUrl($user.banner)}
								<a href={$user.bannerLink ? $user.bannerLink : null} style="display:block; {$user.advert ? "padding-bottom: 6px;" : ""}">
									<Image src={$user.banner} banner="true" alt="bannière d'annonce" style="border-radius:10px;{$user.border ? "border: 1px solid #ddd;" : ''}"/>
									<!-- <img border="0"  data-src={$user.banner} width="410" height="auto"> -->
								</a>
							{/if}
							{#if $user.advert}
							<span style="color:#aaa;font-size:8pt;">Ce message électronique et tous les fichiers qui y sont attachés sont confidentiels et destinés uniquement à la personne ou à l'entité à qui ils sont adressés. Si vous avez reçu ce message par erreur, veuillez en informer immédiatement l'expéditeur et supprimer ce message de votre système. Tout usage, divulgation, distribution ou reproduction de ce message est interdit.</span>
							{/if}
						</td>
					</tr>
				</tbody>
			</table>
			{/if}
		</div>
	</div>
</div>
