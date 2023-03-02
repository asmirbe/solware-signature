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

	// Variables
	let active = false,
	localStore,
	files,
	fileInput,
	imagesLoded = false,
	showMore = false,
	clipboard,
	isLoading = true;

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

</script>

<svelte:head>
	<title>Ma signature Solware</title>
</svelte:head>

<aside class="form-container">
	<div class="logo">
		<svg viewBox="0 0 104 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 11.1936C0 1.97567 1.97567 0 11.1936 0H12.8064C22.0243 0 24 1.97567 24 11.1936V12.8064C24 22.0243 22.0243 24 12.8064 24H11.1936C1.97567 24 0 22.0243 0 12.8064V11.1936Z" fill="#1877F2"/>
			<path d="M18.7476 7.30433C18.1954 7.30433 17.7476 7.75204 17.7476 8.30433V13.4046C17.7476 13.7319 17.7034 14.0198 17.6143 14.2699C17.3407 15.1975 16.6923 15.6608 15.6699 15.6608C15.3752 15.6608 15.0751 15.6464 14.781 15.5763C14.3922 15.4494 14.053 15.2365 13.7626 14.9879L14.1194 14.3638C14.6392 13.5339 14.9421 12.5518 14.9421 11.5236C14.9421 11.5236 14.9656 8.0818 12.591 8.16416C10.2162 8.0815 10.24 11.5236 10.24 11.5236C10.24 12.5518 10.5426 13.5339 11.062 14.3638L11.3533 14.8726C10.8775 15.3579 10.1701 15.6608 9.41858 15.6608C8.86528 15.6608 8.4163 15.5394 8.07164 15.2957C7.55433 14.814 7.29568 14.2223 7.29568 13.5205V8.30433C7.29568 7.75204 6.84796 7.30433 6.29568 7.30433H6.2173C5.66502 7.30433 5.2173 7.75204 5.2173 8.30433V13.583C5.2173 14.1714 5.35456 14.7811 5.62755 15.4112C6.35928 16.9631 7.59917 17.7391 9.3469 17.7391C10.6835 17.7391 11.7306 17.3115 12.4888 16.4562C12.4999 16.444 12.5108 16.4315 12.5215 16.419C12.5288 16.4273 12.5359 16.4352 12.5428 16.4431C13.3203 17.3069 14.3558 17.7391 15.6519 17.7391C16.7819 17.7391 17.718 17.4122 18.4617 16.7582C19.3712 15.8661 19.826 14.7637 19.826 13.4494V8.30433C19.826 7.75204 19.3783 7.30433 18.826 7.30433H18.7476ZM12.5977 10.0095C12.664 10.0077 12.7231 10.0189 12.7756 10.0415C13.2453 10.2401 13.2093 11.2945 13.2093 11.2945C13.2093 11.9057 13.0092 12.6802 12.7332 13.1475C12.7332 13.1475 12.681 13.257 12.5801 13.4305C12.4922 13.257 12.4486 13.1475 12.4486 13.1475C12.1726 12.6802 11.9725 11.9057 11.9725 11.2945C11.9725 11.2945 11.9463 10.2382 12.4203 10.0412C12.4727 10.0189 12.5319 10.0077 12.5977 10.0095Z" fill="white"/>
			<path d="M32.864 7.408H34.46L37.088 11.956H37.184L39.812 7.408H41.42V16H39.812V11.764L39.908 10.324H39.812L37.628 14.176H36.656L34.46 10.324H34.364L34.46 11.764V16H32.864V7.408ZM46.4093 15.376H46.3133C46.1293 15.6 45.9053 15.792 45.6413 15.952C45.3853 16.112 45.0533 16.192 44.6453 16.192C44.3413 16.192 44.0533 16.14 43.7813 16.036C43.5173 15.94 43.2853 15.804 43.0853 15.628C42.8853 15.452 42.7293 15.24 42.6173 14.992C42.5053 14.744 42.4493 14.472 42.4493 14.176C42.4493 13.872 42.5093 13.6 42.6293 13.36C42.7493 13.112 42.9173 12.9 43.1333 12.724C43.3493 12.548 43.6013 12.416 43.8893 12.328C44.1853 12.232 44.5053 12.184 44.8493 12.184C45.2333 12.184 45.5493 12.216 45.7973 12.28C46.0453 12.336 46.2493 12.396 46.4093 12.46V12.28C46.4093 11.968 46.2853 11.712 46.0373 11.512C45.7893 11.304 45.4813 11.2 45.1133 11.2C44.5693 11.2 44.1093 11.428 43.7333 11.884L42.5933 11.104C43.2173 10.32 44.0693 9.928 45.1493 9.928C46.0613 9.928 46.7573 10.144 47.2373 10.576C47.7173 11 47.9573 11.632 47.9573 12.472V16H46.4093V15.376ZM46.4093 13.612C46.2253 13.524 46.0333 13.456 45.8333 13.408C45.6413 13.352 45.4293 13.324 45.1973 13.324C44.8213 13.324 44.5293 13.408 44.3213 13.576C44.1213 13.736 44.0213 13.936 44.0213 14.176C44.0213 14.416 44.1173 14.608 44.3093 14.752C44.5093 14.896 44.7373 14.968 44.9933 14.968C45.2013 14.968 45.3933 14.932 45.5693 14.86C45.7453 14.78 45.8933 14.68 46.0133 14.56C46.1413 14.432 46.2373 14.288 46.3013 14.128C46.3733 13.96 46.4093 13.788 46.4093 13.612ZM54.3006 16.192C53.9326 16.192 53.5806 16.14 53.2446 16.036C52.9086 15.932 52.6006 15.776 52.3206 15.568C52.0406 15.36 51.7966 15.108 51.5886 14.812C51.3806 14.508 51.2166 14.156 51.0966 13.756L52.6206 13.156C52.7326 13.588 52.9286 13.948 53.2086 14.236C53.4886 14.516 53.8566 14.656 54.3126 14.656C54.4806 14.656 54.6406 14.636 54.7926 14.596C54.9526 14.548 55.0926 14.484 55.2126 14.404C55.3406 14.316 55.4406 14.208 55.5126 14.08C55.5846 13.952 55.6206 13.804 55.6206 13.636C55.6206 13.476 55.5926 13.332 55.5366 13.204C55.4806 13.076 55.3846 12.956 55.2486 12.844C55.1206 12.732 54.9486 12.624 54.7326 12.52C54.5246 12.416 54.2646 12.308 53.9526 12.196L53.4246 12.004C53.1926 11.924 52.9566 11.816 52.7166 11.68C52.4846 11.544 52.2726 11.38 52.0806 11.188C51.8886 10.996 51.7286 10.772 51.6006 10.516C51.4806 10.252 51.4206 9.956 51.4206 9.628C51.4206 9.292 51.4846 8.98 51.6126 8.692C51.7486 8.396 51.9366 8.14 52.1766 7.924C52.4246 7.7 52.7166 7.528 53.0526 7.408C53.3966 7.28 53.7766 7.216 54.1926 7.216C54.6246 7.216 54.9966 7.276 55.3086 7.396C55.6286 7.508 55.8966 7.656 56.1126 7.84C56.3366 8.016 56.5166 8.212 56.6526 8.428C56.7886 8.644 56.8886 8.848 56.9526 9.04L55.5246 9.64C55.4446 9.4 55.2966 9.184 55.0806 8.992C54.8726 8.8 54.5846 8.704 54.2166 8.704C53.8646 8.704 53.5726 8.788 53.3406 8.956C53.1086 9.116 52.9926 9.328 52.9926 9.592C52.9926 9.848 53.1046 10.068 53.3286 10.252C53.5526 10.428 53.9086 10.6 54.3966 10.768L54.9366 10.948C55.2806 11.068 55.5926 11.208 55.8726 11.368C56.1606 11.52 56.4046 11.704 56.6046 11.92C56.8126 12.136 56.9686 12.384 57.0726 12.664C57.1846 12.936 57.2406 13.252 57.2406 13.612C57.2406 14.06 57.1486 14.448 56.9646 14.776C56.7886 15.096 56.5606 15.36 56.2806 15.568C56.0006 15.776 55.6846 15.932 55.3326 16.036C54.9806 16.14 54.6366 16.192 54.3006 16.192ZM59.2589 9.268C59.1229 9.268 58.9909 9.244 58.8629 9.196C58.7429 9.14 58.6349 9.068 58.5389 8.98C58.4509 8.884 58.3789 8.776 58.3229 8.656C58.2749 8.536 58.2509 8.404 58.2509 8.26C58.2509 8.116 58.2749 7.984 58.3229 7.864C58.3789 7.744 58.4509 7.64 58.5389 7.552C58.6349 7.456 58.7429 7.384 58.8629 7.336C58.9909 7.28 59.1229 7.252 59.2589 7.252C59.5389 7.252 59.7789 7.352 59.9789 7.552C60.1789 7.744 60.2789 7.98 60.2789 8.26C60.2789 8.54 60.1789 8.78 59.9789 8.98C59.7789 9.172 59.5389 9.268 59.2589 9.268ZM58.4789 16V10.12H60.0509V16H58.4789ZM64.1418 18.784C63.7258 18.784 63.3538 18.728 63.0258 18.616C62.7058 18.512 62.4258 18.372 62.1858 18.196C61.9458 18.028 61.7458 17.84 61.5858 17.632C61.4258 17.424 61.3098 17.216 61.2378 17.008L62.7378 16.408C62.8498 16.72 63.0338 16.96 63.2898 17.128C63.5458 17.304 63.8298 17.392 64.1418 17.392C64.6378 17.392 65.0298 17.236 65.3178 16.924C65.6058 16.62 65.7498 16.192 65.7498 15.64V15.232H65.6538C65.4698 15.488 65.2258 15.692 64.9218 15.844C64.6258 15.988 64.2738 16.06 63.8658 16.06C63.5138 16.06 63.1698 15.988 62.8338 15.844C62.5058 15.7 62.2138 15.496 61.9578 15.232C61.7018 14.96 61.4938 14.636 61.3338 14.26C61.1738 13.884 61.0938 13.464 61.0938 13C61.0938 12.536 61.1738 12.116 61.3338 11.74C61.4938 11.356 61.7018 11.032 61.9578 10.768C62.2138 10.496 62.5058 10.288 62.8338 10.144C63.1698 10 63.5138 9.928 63.8658 9.928C64.2738 9.928 64.6258 10.004 64.9218 10.156C65.2258 10.3 65.4698 10.5 65.6538 10.756H65.7498V10.12H67.2498V15.58C67.2498 16.076 67.1738 16.52 67.0218 16.912C66.8698 17.312 66.6578 17.648 66.3858 17.92C66.1138 18.2 65.7858 18.412 65.4018 18.556C65.0258 18.708 64.6058 18.784 64.1418 18.784ZM64.2018 14.644C64.3938 14.644 64.5818 14.608 64.7658 14.536C64.9578 14.464 65.1258 14.36 65.2698 14.224C65.4138 14.08 65.5298 13.908 65.6178 13.708C65.7058 13.5 65.7498 13.264 65.7498 13C65.7498 12.736 65.7058 12.5 65.6178 12.292C65.5298 12.084 65.4138 11.912 65.2698 11.776C65.1258 11.632 64.9578 11.524 64.7658 11.452C64.5818 11.38 64.3938 11.344 64.2018 11.344C64.0098 11.344 63.8218 11.38 63.6378 11.452C63.4538 11.524 63.2898 11.632 63.1458 11.776C63.0018 11.92 62.8858 12.096 62.7978 12.304C62.7098 12.504 62.6658 12.736 62.6658 13C62.6658 13.264 62.7098 13.5 62.7978 13.708C62.8858 13.908 63.0018 14.08 63.1458 14.224C63.2898 14.36 63.4538 14.464 63.6378 14.536C63.8218 14.608 64.0098 14.644 64.2018 14.644ZM70.066 10.888H70.162C70.346 10.592 70.594 10.36 70.906 10.192C71.218 10.016 71.574 9.928 71.974 9.928C72.342 9.928 72.666 9.988 72.946 10.108C73.226 10.228 73.454 10.4 73.63 10.624C73.814 10.84 73.95 11.104 74.038 11.416C74.134 11.72 74.182 12.06 74.182 12.436V16H72.61V12.628C72.61 12.204 72.514 11.892 72.322 11.692C72.138 11.484 71.866 11.38 71.506 11.38C71.29 11.38 71.098 11.428 70.93 11.524C70.77 11.612 70.63 11.736 70.51 11.896C70.398 12.048 70.31 12.232 70.246 12.448C70.19 12.656 70.162 12.88 70.162 13.12V16H68.59V10.12H70.066V10.888ZM79.046 15.376H78.95C78.766 15.6 78.542 15.792 78.278 15.952C78.022 16.112 77.69 16.192 77.282 16.192C76.978 16.192 76.69 16.14 76.418 16.036C76.154 15.94 75.922 15.804 75.722 15.628C75.522 15.452 75.366 15.24 75.254 14.992C75.142 14.744 75.086 14.472 75.086 14.176C75.086 13.872 75.146 13.6 75.266 13.36C75.386 13.112 75.554 12.9 75.77 12.724C75.986 12.548 76.238 12.416 76.526 12.328C76.822 12.232 77.142 12.184 77.486 12.184C77.87 12.184 78.186 12.216 78.434 12.28C78.682 12.336 78.886 12.396 79.046 12.46V12.28C79.046 11.968 78.922 11.712 78.674 11.512C78.426 11.304 78.118 11.2 77.75 11.2C77.206 11.2 76.746 11.428 76.37 11.884L75.23 11.104C75.854 10.32 76.706 9.928 77.786 9.928C78.698 9.928 79.394 10.144 79.874 10.576C80.354 11 80.594 11.632 80.594 12.472V16H79.046V15.376ZM79.046 13.612C78.862 13.524 78.67 13.456 78.47 13.408C78.278 13.352 78.066 13.324 77.834 13.324C77.458 13.324 77.166 13.408 76.958 13.576C76.758 13.736 76.658 13.936 76.658 14.176C76.658 14.416 76.754 14.608 76.946 14.752C77.146 14.896 77.374 14.968 77.63 14.968C77.838 14.968 78.03 14.932 78.206 14.86C78.382 14.78 78.53 14.68 78.65 14.56C78.778 14.432 78.874 14.288 78.938 14.128C79.01 13.96 79.046 13.788 79.046 13.612ZM82.3747 11.464H81.3427V10.12H82.3747V8.32H83.9467V10.12H85.3867V11.464H83.9467V13.744C83.9467 13.88 83.9587 14.008 83.9827 14.128C84.0147 14.24 84.0707 14.336 84.1507 14.416C84.2627 14.544 84.4227 14.608 84.6307 14.608C84.7667 14.608 84.8747 14.596 84.9547 14.572C85.0347 14.54 85.1107 14.5 85.1827 14.452L85.6267 15.832C85.4427 15.92 85.2427 15.984 85.0267 16.024C84.8187 16.072 84.5867 16.096 84.3307 16.096C84.0347 16.096 83.7667 16.052 83.5267 15.964C83.2947 15.868 83.0987 15.74 82.9387 15.58C82.5627 15.22 82.3747 14.708 82.3747 14.044V11.464ZM90.6111 15.232H90.5151C90.3311 15.528 90.0831 15.764 89.7711 15.94C89.4591 16.108 89.1031 16.192 88.7031 16.192C87.9591 16.192 87.4031 15.964 87.0351 15.508C86.6751 15.052 86.4951 14.444 86.4951 13.684V10.12H88.0671V13.492C88.0671 13.916 88.1591 14.232 88.3431 14.44C88.5351 14.64 88.8111 14.74 89.1711 14.74C89.3871 14.74 89.5751 14.696 89.7351 14.608C89.9031 14.512 90.0431 14.388 90.1551 14.236C90.2751 14.076 90.3631 13.892 90.4191 13.684C90.4831 13.468 90.5151 13.24 90.5151 13V10.12H92.0871V16H90.6111V15.232ZM93.4337 10.12H94.9097V10.936H95.0057C95.0777 10.792 95.1737 10.66 95.2937 10.54C95.4137 10.42 95.5457 10.316 95.6897 10.228C95.8417 10.14 96.0017 10.072 96.1697 10.024C96.3457 9.976 96.5177 9.952 96.6857 9.952C96.8937 9.952 97.0697 9.972 97.2137 10.012C97.3657 10.052 97.4937 10.104 97.5977 10.168L97.1777 11.596C97.0817 11.548 96.9737 11.512 96.8537 11.488C96.7417 11.456 96.6017 11.44 96.4337 11.44C96.2177 11.44 96.0217 11.484 95.8457 11.572C95.6697 11.652 95.5177 11.768 95.3897 11.92C95.2697 12.072 95.1737 12.252 95.1017 12.46C95.0377 12.66 95.0057 12.88 95.0057 13.12V16H93.4337V10.12ZM103.525 14.584C103.253 15.064 102.885 15.452 102.421 15.748C101.965 16.044 101.405 16.192 100.741 16.192C100.293 16.192 99.8772 16.116 99.4932 15.964C99.1172 15.804 98.7892 15.584 98.5092 15.304C98.2292 15.024 98.0092 14.696 97.8492 14.32C97.6972 13.936 97.6212 13.516 97.6212 13.06C97.6212 12.636 97.6972 12.236 97.8492 11.86C98.0012 11.476 98.2132 11.144 98.4852 10.864C98.7572 10.576 99.0772 10.348 99.4452 10.18C99.8212 10.012 100.233 9.928 100.681 9.928C101.153 9.928 101.573 10.008 101.941 10.168C102.309 10.32 102.617 10.536 102.865 10.816C103.113 11.088 103.301 11.412 103.429 11.788C103.557 12.164 103.621 12.572 103.621 13.012C103.621 13.068 103.621 13.116 103.621 13.156C103.613 13.204 103.609 13.248 103.609 13.288C103.601 13.328 103.597 13.372 103.597 13.42H99.1692C99.2012 13.66 99.2652 13.868 99.3612 14.044C99.4652 14.212 99.5892 14.356 99.7332 14.476C99.8852 14.588 100.049 14.672 100.225 14.728C100.401 14.776 100.581 14.8 100.765 14.8C101.125 14.8 101.421 14.72 101.653 14.56C101.893 14.392 102.081 14.184 102.217 13.936L103.525 14.584ZM102.097 12.304C102.089 12.2 102.053 12.084 101.989 11.956C101.933 11.828 101.845 11.708 101.725 11.596C101.613 11.484 101.469 11.392 101.293 11.32C101.125 11.248 100.921 11.212 100.681 11.212C100.345 11.212 100.049 11.308 99.7932 11.5C99.5372 11.692 99.3572 11.96 99.2532 12.304H102.097Z" fill="black"/>
		</svg>
	</div>
	<div class="content">
		<h1>Générateur de signature</h1>
		<div class="field">
			<label for="name">Prénom et Nom</label>
			<input type="text" spellcheck="false" autocomplete="off" id="name" bind:value={$user.name} />
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
			<input type="text" spellcheck="false" autocomplete="off" id="position" bind:value={$user.position} />
		</div>
		<div class="field">
			<label for="email">Email</label>
			<input type="email" id="email" bind:value={$user.email} />
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
		<div class="field">
			<label for="linkedin">LinkedIn</label>
			<input type="text" spellcheck="false" autocomplete="off" id="linkedin" placeholder="Lien de votre LinkedIn" bind:value={$user.linkedin} />
		</div>
		<!-- Relative -->
		<div>
			<div class="separator" />
			<div use:accordion={showMore}  class="more {showMore ? '' : 'hidden'}">
				<h2>Plus d'options</h2>
					<!-- svelte-ignore a11y-label-has-associated-control -->
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
			<table
			width="600"
			cellspacing="0"
			cellpadding="0"
			border="0"
			style="border-collapse: initial; padding: 32px 0; font-size:13px;font-weight: 500; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
		>
			<tbody>
				<tr>
					{#if $user.pictureUrl}
						<td width="100" style="vertical-align:top;padding:0 16px">
							<Image src={$user.pictureUrl} alt="avatar" style="border-radius: 10px;border:none" />
						</td>
						<td style="border-left:solid #eaecf0 1px" width="16" />
					{/if}
					<td
						style="vertical-align: top; text-align:left;color:#000000; text-align:left"
					>
						<span
							style="display: block; padding-top: 10px; line-height:0;color:#000000;font-size:15px; font-weight: bold;"
						>
							{$user.name}
						</span>
						<br />
						<span style="margin-bottom:16px;color:#4C4C4C;">
							{$user.position} @
							<a
								href="https://www.solware.fr/"
								data-external="true"
								style="text-decoration:none;color:#2E90FA"
							>
								Solware
							</a>
						</span>
						<!-- tel -->
						{#if $user.phone}
						<br>
						<span style="margin-bottom:16px;color:#4C4C4C;">
							<a
							href="tel:{$user.phone}"
							data-external="true"
							style="text-decoration:none;color:#8C8C8C">{$user.phone}</a>
						</span>
						{/if}
						<br />
						<br />
						<span style="color:#8C8C8C;">
							68 Bis Chem. du Moulin Carron
							<br />
							Dardilly, France 69570
						</span>
						<br />
						<table
							cellpadding="0"
							border="0"
							style="vertical-align:top; padding-top: 16px; border-collapse: initial;"
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
						{#if $user.banner}
							<br>
							<a href={$user.bannerLink ? $user.bannerLink : null} style="display:block;">
								<Image src={$user.banner} banner="true" alt="bannière d'annonce" style="border-radius:10px;{$user.border ? "border: 1px solid #ddd;" : null}"/>
								<!-- <img border="0"  data-src={$user.banner} width="410" height="auto"> -->
							</a>
						{/if}
						{#if $user.advert}
						<br>
						<span style="color:#a1a1a1;font-size:12px;">Ce message électronique et tous les fichiers qui y sont attachés sont confidentiels et destinés uniquement à la personne ou à l'entité à qui ils sont adressés. Si vous avez reçu ce message par erreur, veuillez en informer immédiatement l'expéditeur et supprimer ce message de votre système. Tout usage, divulgation, distribution ou reproduction de ce message est interdit.</span>
						{/if}
					</td>
				</tr>
			</tbody>
		</table>
		</div>
	</div>
</div>
