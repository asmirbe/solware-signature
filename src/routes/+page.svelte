<script>
	import "../scss/main.scss";
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from "svelte";
	import user, { deleteFromlocalStore , resetToDefault } from "$stores/store.js";
	import { notifications } from "$lib/notifications.js";
	import Notification from "../component/notification.svelte";
	// import Dropdown from "$components/dropdown.svelte";
	import { accordion } from "$lib/accordion.js";
	import { tooltip } from "$lib/tooltip.js";
	import ClipboardJS from "clipboard";
	import { fade } from 'svelte/transition'

	// Variables
	let localStore,
	files,
	fileInput,
	signLoading = true,
	showMore = false,
	imageLoading = false,
	loadedAnnounce = null,
	loadedImage = null,
	clipboard,
	naturalWidth = 0,
	naturalHeight = 0,
	newHeight = 0;


	let fontOptions = [
    { id: "Arial", name: "Arial" },
    { id: "Helvetica", name: "Helvetica" },
    { id: "Times New Roman", name: "Times New Roman" },
  ];

	const loadImage = (src, banner) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
				if (banner) {
					naturalWidth = img.naturalWidth;
					naturalHeight = img.naturalHeight;
					if (naturalWidth > 412) {
						const aspectRatio = naturalWidth / naturalHeight;
						newHeight = Math.floor(412 / aspectRatio);
						naturalWidth = 412;
					}
				}
				resolve(img)
			};
      img.onerror = reject;
      img.src = src;
    });


	onMount(async () => {
		localStore = localStorage.getItem("user") ? true : false;
		signLoading = localStorage ? false : true;
		clipboard = new ClipboardJS(".btn");
		clipboard.on("success", function (e) {
			notifications.success("Copié dans le presse-papier", 1000);
			e.clearSelection();
		});
		if($user.pictureUrl) loadedImage = await loadImage($user.pictureUrl);
		if($user.banner) loadedAnnounce = await loadImage($user.banner, true);
		window.addEventListener("keydown", handleKeyDown);
	});

	// Capture ctrl + s
	function handleKeyDown(event) {
    if (event.ctrlKey && event.key === "s") {
			event.preventDefault();
			saveData();
    }
  }

	// Destroy clipboard
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
	async function uploadFunction(image, input) {
		if (!image) return;
		const data = {};
		$user.hasPic = true;
		loadedImage = null;
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
      if (responseJson.error) {
        notifications.warning(responseJson.error, 1000);
      }
			$user.pictureUrl = responseJson.secure_url;
			loadedImage = await loadImage($user.pictureUrl);
		} catch (error) {
			console.log(error);
		}
	}

	// Check if URL of image is valid
	async function checkImageUrl(url) {
		if(!url) return;
		if($user.banner) {
			const validFormats = ['jpeg', 'jpg', 'gif', 'png', 'webp', 'bmp', 'tiff'];
			const pattern = new RegExp(`^https?://.+\\.(${validFormats.join('|')})$`, 'i');
			if(pattern.test(url)) {
				loadedAnnounce = await loadImage(url, true);
				return true;
			}
		}
  }
	$: console.log($user.hasPic), console.log($user.pictureUrl)
</script>

<svelte:head>
	<title>Email signature - Solware</title>
</svelte:head>

<aside class="form-container">
	<a href="/" class="logo">
		<svg width="1094" height="164" viewBox="0 0 1094 164" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M435.286 22V3.26626H428V0H446.381V3.26626H439.04V22H435.286ZM448.893 22V0H454.413L460.098 17.573L465.591 0H471V22H467.578V3.5362L461.782 22H458.387L452.343 3.26626V22H448.893Z" fill="black"/>
			<path d="M62.2446 48.2302C48.0886 48.2302 32.9668 56.5792 29.1446 68.5792V50.9364H0V160.645H30.81V95.6942C31.0182 84.4527 40.5943 75.7094 52.8767 75.7094C65.3672 75.7094 74.5269 83.62 74.5269 97.5678V160.645H105.129V91.5307C105.129 65.9251 88.4747 48.2302 62.2446 48.2302Z" fill="black"/>
			<path d="M150.812 115.263H233.041C233.458 112.556 233.666 108.393 233.666 103.605C233.666 76.1257 212.64 48.4383 177.25 48.4383C145.816 48.4383 120.627 74.044 120.627 105.895C120.627 138.578 143.734 163.351 179.332 163.351C206.187 163.351 220.343 152.318 228.878 139.828L205.354 124.214C200.566 132.958 193.696 137.746 180.165 137.746C165.592 137.746 154.351 129.627 150.812 115.263ZM150.396 95.0697C153.518 80.0811 163.927 71.754 178.083 71.754C192.239 71.754 201.815 80.7056 204.73 95.0697H150.396Z" fill="black"/>
			<path d="M349.317 160.645L307.89 105.479L348.485 50.9364H315.801L291.445 83.62L266.88 50.9364H232.739L272.709 104.021L229.824 160.645H262.508L289.155 125.88L315.385 160.645H349.317Z" fill="black"/>
			<path d="M410.233 160.645H428.345V133.79H416.687C405.862 133.79 399.824 127.545 399.824 115.887V77.1666H427.512V50.9364H400.865V22H370.888V39.0704C370.888 46.9811 367.141 50.9364 359.647 50.9364H350.279V77.1666H369.014V119.634C369.014 144.407 382.962 160.645 410.233 160.645Z" fill="black"/>
			<path d="M530.213 98.3438V101.719H497.658C498.01 105.258 499.193 108.023 501.209 110.016C503.248 112.008 505.979 113.004 509.4 113.004C512.377 113.004 514.896 112.336 516.959 111C519.045 109.664 520.51 107.812 521.354 105.445L529.545 107.625C528.35 111.82 525.947 115.125 522.338 117.539C518.752 119.953 514.393 121.16 509.26 121.16C502.861 121.16 497.787 119.156 494.037 115.148C490.311 111.141 488.447 105.867 488.447 99.3281C488.447 92.8359 490.416 87.5273 494.354 83.4023C498.314 79.2773 503.494 77.2148 509.893 77.2148C513.104 77.2148 515.998 77.7539 518.576 78.832C521.154 79.8867 523.275 81.375 524.939 83.2969C526.627 85.1953 527.916 87.4219 528.807 89.9766C529.697 92.5312 530.166 95.3203 530.213 98.3438ZM509.471 84.8789C506.33 84.8789 503.693 85.8047 501.561 87.6562C499.451 89.5078 498.174 91.957 497.729 95.0039H520.932C520.51 91.8164 519.314 89.332 517.346 87.5508C515.377 85.7695 512.752 84.8789 509.471 84.8789ZM589.029 77.2148C593.951 77.2148 597.643 78.7852 600.104 81.9258C602.564 85.043 603.795 89.4727 603.795 95.2148V120H594.443V95.9531C594.443 89.0859 591.607 85.6523 585.936 85.6523C582.959 85.6523 580.58 86.6016 578.799 88.5C577.041 90.3984 576.162 93.0234 576.162 96.375V120H566.775V95.9531C566.775 89.0859 563.904 85.6523 558.162 85.6523C555.209 85.6523 552.842 86.6016 551.061 88.5C549.303 90.3984 548.424 93.0234 548.424 96.375V120H539.072V78.375H546.42L548.143 84.0703C549.502 81.8438 551.295 80.1445 553.521 78.9727C555.771 77.8008 558.326 77.2148 561.186 77.2148C567.678 77.2148 572.084 79.9336 574.404 85.3711C575.764 82.7227 577.697 80.707 580.205 79.3242C582.736 77.918 585.678 77.2148 589.029 77.2148ZM632.307 77.2148C638.564 77.2148 643.264 78.7617 646.404 81.8555C649.568 84.9492 651.15 89.2852 651.15 94.8633V120H643.803L642.01 113.953C640.322 116.297 638.119 118.09 635.4 119.332C632.705 120.551 629.729 121.16 626.471 121.16C621.83 121.16 618.232 119.977 615.678 117.609C613.123 115.242 611.846 112.172 611.846 108.398C611.846 106.57 612.162 104.895 612.795 103.371C613.451 101.848 614.424 100.477 615.713 99.2578C617.025 98.0391 618.783 97.0898 620.986 96.4102C623.213 95.7305 625.779 95.3906 628.686 95.3906C633.373 95.3906 637.744 96.1758 641.799 97.7461V95.3906C641.799 92.0859 640.932 89.5781 639.197 87.8672C637.486 86.1562 635.037 85.3008 631.85 85.3008C626.67 85.3008 623.436 87.75 622.146 92.6484L613.428 90.5391C615.701 81.6562 621.994 77.2148 632.307 77.2148ZM628.826 113.602C630.912 113.602 632.904 113.238 634.803 112.512C636.725 111.762 638.354 110.625 639.689 109.102C641.025 107.555 641.729 105.785 641.799 103.793C638.377 102.551 634.486 101.93 630.127 101.93C624.174 101.93 621.197 103.875 621.197 107.766C621.197 109.758 621.9 111.234 623.307 112.195C624.713 113.133 626.553 113.602 628.826 113.602ZM666.654 73.1367C664.732 73.1367 663.197 72.6094 662.049 71.5547C660.9 70.5 660.326 69.082 660.326 67.3008C660.326 65.543 660.9 64.1484 662.049 63.1172C663.197 62.0625 664.732 61.5352 666.654 61.5352C668.506 61.5352 670.006 62.0625 671.154 63.1172C672.326 64.1719 672.912 65.5664 672.912 67.3008C672.912 69.082 672.326 70.5 671.154 71.5547C670.006 72.6094 668.506 73.1367 666.654 73.1367ZM661.979 120V78.375H671.33V120H661.979ZM682.65 120V62.4141H692.002V120H682.65ZM738.021 121.16C732.443 121.16 727.979 120.094 724.627 117.961C721.299 115.828 719.131 112.734 718.123 108.68L726.771 106.887C728.084 111.363 731.975 113.602 738.443 113.602C741.467 113.602 743.787 113.156 745.404 112.266C747.045 111.375 747.865 110.062 747.865 108.328C747.865 107.25 747.549 106.348 746.916 105.621C746.283 104.895 745.428 104.344 744.35 103.969C743.295 103.594 742.076 103.289 740.693 103.055C739.311 102.82 737.857 102.598 736.334 102.387C734.811 102.176 733.287 101.941 731.764 101.684C730.24 101.402 728.787 100.992 727.404 100.453C726.021 99.8906 724.791 99.1992 723.713 98.3789C722.658 97.5352 721.814 96.4102 721.182 95.0039C720.549 93.5742 720.232 91.8984 720.232 89.9766C720.232 86.1562 721.791 83.0742 724.908 80.7305C728.025 78.3867 732.268 77.2148 737.635 77.2148C742.885 77.2148 747.104 78.3281 750.291 80.5547C753.502 82.7578 755.529 85.8047 756.373 89.6953L747.654 91.5586C747.139 89.3555 745.979 87.6797 744.174 86.5312C742.369 85.3828 740.025 84.8086 737.143 84.8086C734.635 84.8086 732.689 85.207 731.307 86.0039C729.924 86.8008 729.232 87.9375 729.232 89.4141C729.232 90.4453 729.549 91.3008 730.182 91.9805C730.814 92.6602 731.658 93.1875 732.713 93.5625C733.791 93.9141 735.021 94.207 736.404 94.4414C737.787 94.6758 739.24 94.8984 740.764 95.1094C742.311 95.3203 743.846 95.5781 745.369 95.8828C746.916 96.1641 748.381 96.5977 749.764 97.1836C751.146 97.7461 752.365 98.4609 753.42 99.3281C754.498 100.195 755.354 101.355 755.986 102.809C756.619 104.262 756.936 105.961 756.936 107.906C756.936 112.031 755.283 115.277 751.979 117.645C748.674 119.988 744.021 121.16 738.021 121.16ZM770.365 73.1367C768.443 73.1367 766.908 72.6094 765.76 71.5547C764.611 70.5 764.037 69.082 764.037 67.3008C764.037 65.543 764.611 64.1484 765.76 63.1172C766.908 62.0625 768.443 61.5352 770.365 61.5352C772.217 61.5352 773.717 62.0625 774.865 63.1172C776.037 64.1719 776.623 65.5664 776.623 67.3008C776.623 69.082 776.037 70.5 774.865 71.5547C773.717 72.6094 772.217 73.1367 770.365 73.1367ZM765.689 120V78.375H775.041V120H765.689ZM819.549 78.0938H826.896V116.625C826.896 122.109 824.998 126.398 821.201 129.492C817.404 132.609 812.096 134.168 805.275 134.168C794.541 134.168 787.92 130.664 785.412 123.656L793.85 120.949C795.818 124.535 799.58 126.328 805.135 126.328C808.955 126.328 811.979 125.449 814.205 123.691C816.432 121.934 817.545 119.426 817.545 116.168V111.949C814.357 116.543 809.482 118.84 802.92 118.84C797.412 118.84 792.865 116.953 789.279 113.18C785.693 109.406 783.9 104.379 783.9 98.0977C783.9 94.957 784.393 92.0742 785.377 89.4492C786.385 86.8008 787.744 84.5977 789.455 82.8398C791.166 81.0586 793.182 79.6758 795.502 78.6914C797.846 77.707 800.342 77.2148 802.99 77.2148C805.967 77.2148 808.744 77.7539 811.322 78.832C813.924 79.8867 816.068 81.6094 817.756 84L819.549 78.0938ZM796.557 107.062C798.689 109.359 801.572 110.508 805.205 110.508C808.838 110.508 811.803 109.43 814.1 107.273C816.396 105.117 817.545 102.059 817.545 98.0977C817.545 94.1133 816.396 91.0781 814.1 88.9922C811.826 86.9062 808.861 85.8633 805.205 85.8633C801.572 85.8633 798.689 87 796.557 89.2734C794.447 91.5469 793.393 94.4883 793.393 98.0977C793.393 101.777 794.447 104.766 796.557 107.062ZM861.49 77.2148C866.811 77.2148 870.83 78.8203 873.549 82.0312C876.268 85.2422 877.627 89.7422 877.627 95.5312V120H868.275V96.375C868.275 92.6953 867.42 89.9883 865.709 88.2539C863.998 86.5195 861.607 85.6523 858.537 85.6523C855.256 85.6523 852.596 86.625 850.557 88.5703C848.541 90.5156 847.533 93.0938 847.533 96.3047V120H838.182V78.375H845.529L847.252 84.1406C848.752 81.9141 850.709 80.2031 853.123 79.0078C855.537 77.8125 858.326 77.2148 861.49 77.2148ZM906.104 77.2148C912.361 77.2148 917.061 78.7617 920.201 81.8555C923.365 84.9492 924.947 89.2852 924.947 94.8633V120H917.6L915.807 113.953C914.119 116.297 911.916 118.09 909.197 119.332C906.502 120.551 903.525 121.16 900.268 121.16C895.627 121.16 892.029 119.977 889.475 117.609C886.92 115.242 885.643 112.172 885.643 108.398C885.643 106.57 885.959 104.895 886.592 103.371C887.248 101.848 888.221 100.477 889.51 99.2578C890.822 98.0391 892.58 97.0898 894.783 96.4102C897.01 95.7305 899.576 95.3906 902.482 95.3906C907.17 95.3906 911.541 96.1758 915.596 97.7461V95.3906C915.596 92.0859 914.729 89.5781 912.994 87.8672C911.283 86.1562 908.834 85.3008 905.646 85.3008C900.467 85.3008 897.232 87.75 895.943 92.6484L887.225 90.5391C889.498 81.6562 895.791 77.2148 906.104 77.2148ZM902.623 113.602C904.709 113.602 906.701 113.238 908.6 112.512C910.521 111.762 912.15 110.625 913.486 109.102C914.822 107.555 915.525 105.785 915.596 103.793C912.174 102.551 908.283 101.93 903.924 101.93C897.971 101.93 894.994 103.875 894.994 107.766C894.994 109.758 895.697 111.234 897.104 112.195C898.51 113.133 900.35 113.602 902.623 113.602ZM959.471 108.188L967.1 110.719C966.186 114.07 964.475 116.648 961.967 118.453C959.482 120.258 956.295 121.16 952.404 121.16C947.717 121.16 944.107 119.848 941.576 117.223C939.045 114.574 937.779 110.777 937.779 105.832V86.4609H931.24V78.375H938.377L940.311 69.5859H947.166V78.375H964.006V86.4609H947.166V105.832C947.166 108.082 947.682 109.816 948.713 111.035C949.744 112.254 951.197 112.863 953.072 112.863C956.213 112.863 958.346 111.305 959.471 108.188ZM1001.9 78.375H1011.26V120H1003.91L1002.12 114.023C1000.66 116.344 998.717 118.113 996.279 119.332C993.865 120.551 991.064 121.16 987.877 121.16C982.674 121.16 978.783 119.602 976.205 116.484C973.65 113.344 972.373 108.902 972.373 103.16V78.375H981.76V102.809C981.76 109.465 984.736 112.793 990.689 112.793C993.947 112.793 996.631 111.785 998.74 109.77C1000.85 107.73 1001.9 105.07 1001.9 101.789V78.375ZM1045.01 77.2148C1046.37 77.2148 1047.78 77.3672 1049.26 77.6719L1048.24 86.3906C1046.67 85.9922 1044.94 85.793 1043.04 85.793C1039.94 85.793 1037.32 86.8945 1035.16 89.0977C1033.03 91.3008 1031.96 94.207 1031.96 97.8164V120H1022.61V78.375H1029.96L1031.75 84.5625C1033.18 82.1953 1035.02 80.3789 1037.27 79.1133C1039.54 77.8477 1042.12 77.2148 1045.01 77.2148ZM1093.13 98.3438V101.719H1060.58C1060.93 105.258 1062.12 108.023 1064.13 110.016C1066.17 112.008 1068.9 113.004 1072.32 113.004C1075.3 113.004 1077.82 112.336 1079.88 111C1081.97 109.664 1083.43 107.812 1084.28 105.445L1092.47 107.625C1091.27 111.82 1088.87 115.125 1085.26 117.539C1081.67 119.953 1077.31 121.16 1072.18 121.16C1065.78 121.16 1060.71 119.156 1056.96 115.148C1053.23 111.141 1051.37 105.867 1051.37 99.3281C1051.37 92.8359 1053.34 87.5273 1057.28 83.4023C1061.24 79.2773 1066.42 77.2148 1072.81 77.2148C1076.03 77.2148 1078.92 77.7539 1081.5 78.832C1084.08 79.8867 1086.2 81.375 1087.86 83.2969C1089.55 85.1953 1090.84 87.4219 1091.73 89.9766C1092.62 92.5312 1093.09 95.3203 1093.13 98.3438ZM1072.39 84.8789C1069.25 84.8789 1066.62 85.8047 1064.48 87.6562C1062.37 89.5078 1061.1 91.957 1060.65 95.0039H1083.85C1083.43 91.8164 1082.24 89.332 1080.27 87.5508C1078.3 85.7695 1075.67 84.8789 1072.39 84.8789Z" fill="black"/>
		</svg>
	</a>
	<div class="content">
		<h1>Générateur de signature</h1>
		<div class="field">
			<label for="name">Prénom et Nom</label>
			<input type="text" spellcheck="false" autocomplete="off" id="name" placeholder="Prénom et nom" bind:value={$user.name} />
		</div>
		<div class="field">
			<label for="uploadFile">Image</label>
			<div class="input-file" class:active={$user.pictureUrl}>
				<input
					tabindex="-1"
					id="uploadFile"
					type="file"
					class="btn -secondary"
					bind:files
					accept=".png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.jfif,.pjpeg,.pjp,.avif"
					bind:this={fileInput}
					on:change={(e) => uploadFunction(files[0], e.target)}
				/>
				<div class="inline-btn">
				<button for="uploadFile" class="btn -secondary" on:click={() => fileInput.click()}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M16.2 21H6.93137C6.32555 21 6.02265 21 5.88238 20.8802C5.76068 20.7763 5.69609 20.6203 5.70865 20.4608C5.72312 20.2769 5.93731 20.0627 6.36569 19.6343L14.8686 11.1314C15.2646 10.7354 15.4627 10.5373 15.691 10.4632C15.8918 10.3979 16.1082 10.3979 16.309 10.4632C16.5373 10.5373 16.7354 10.7354 17.1314 11.1314L21 15V16.2M16.2 21C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2M16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					{$user.hasPic ? "Remplacer" : "Choisir"}
				</button>
				{#if $user.hasPic}
				<button use:tooltip title="Supprimer l'image" class="btn -secondary -remove -square" on:click={
					() => {
						notifications.success('Image supprimé', 1000)
						deleteFromlocalStore("pictureUrl");
						$user.hasPic = false;
						fileInput.value = "";
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
			<div use:accordion={showMore} class="more hidden">
				<h2>Plus d'options</h2>
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<div class="field">
						<label for="linkedin">LinkedIn personnel</label>
						<input type="text" spellcheck="false" autocomplete="off" id="linkedin" placeholder="Lien de votre LinkedIn" bind:value={$user.linkedin} />
					</div>
					<fieldset class="field fieldset">
						<div class="field">
							<label for="uploadBanner">Bannière d'annonce
								<svg use:tooltip title="Image au format .jpg, .jpeg, .png" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clip-path="url(#clip0_1054_159)">
									<path d="M6.05998 5.99998C6.21672 5.55442 6.52608 5.17872 6.93328 4.9394C7.34048 4.70009 7.81924 4.61261 8.28476 4.69245C8.75028 4.7723 9.17252 5.01433 9.4767 5.37567C9.78087 5.737 9.94735 6.19433 9.94665 6.66665C9.94665 7.99998 7.94665 8.66665 7.94665 8.66665M7.99998 11.3333H8.00665M14.6666 7.99998C14.6666 11.6819 11.6819 14.6666 7.99998 14.6666C4.31808 14.6666 1.33331 11.6819 1.33331 7.99998C1.33331 4.31808 4.31808 1.33331 7.99998 1.33331C11.6819 1.33331 14.6666 4.31808 14.6666 7.99998Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
									</g>
									<defs>
									<clipPath id="clip0_1054_159">
									<rect width="16" height="16" fill="white"/>
									</clipPath>
									</defs>
								</svg>
							</label>
							<div class="inline-btn">
								<button use:tooltip title="Afficher ou cacher l'annonce" disabled={!$user.banner} class="btn -secondary -square in-input" on:click={() => {$user.hideAnnouncement = !$user.hideAnnouncement}}>
									{#if !$user.hideAnnouncement}
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
									{:else}
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M10.7429 5.09232C11.1494 5.03223 11.5686 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7767C21.8518 11.9016 21.8517 12.0987 21.8231 12.2236C21.7849 12.3899 21.7164 12.4985 21.5792 12.7156C21.2793 13.1901 20.8222 13.8571 20.2165 14.5805M6.72432 6.71504C4.56225 8.1817 3.09445 10.2194 2.42111 11.2853C2.28428 11.5019 2.21587 11.6102 2.17774 11.7765C2.1491 11.9014 2.14909 12.0984 2.17771 12.2234C2.21583 12.3897 2.28393 12.4975 2.42013 12.7132C3.54554 14.4952 6.89541 19 12.0004 19C14.0588 19 15.8319 18.2676 17.2888 17.2766M3.00042 3L21.0004 21M9.8791 9.87868C9.3362 10.4216 9.00042 11.1716 9.00042 12C9.00042 13.6569 10.3436 15 12.0004 15C12.8288 15 13.5788 14.6642 14.1217 14.1213" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									{/if}
								</button>
								<input type="text" spellcheck="false" autocomplete="off" bind:value={$user.banner} placeholder="Lien de l'image de votre bannière">
							</div>
						</div>
						<div class="field">
							<label for="bannerLink">Lien internet de l'annonce</label>
							<input type="text" disabled={!$user.banner} bind:value={$user.bannerLink} id="bannerLink" placeholder="Lien d'annonce">
						</div>
						<div class="field -inline">
							<label for="border">Contour</label><input disabled={!$user.banner} id="border" bind:checked={$user.border} type="checkbox" class="checkbox switch">
						</div>
						<!-- <div class="field">
							<label>Police</label>
							<Dropdown options={fontOptions} obj="font" />
						</div> -->
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
							<button use:tooltip title="Supprimer le profil" class="btn -secondary -remove -square" on:click={removeUser}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</button>
						{/if}
					</div>
				</div>
				<div class="desc">
					<p>
						Veuillez remplir les informations demandées et coller le contenu dans l'espace <a href="./outlook.png" target="_blank"><u>signature électronique</u></a> d'Outlook.</p>
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
				<style type="text/css">@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');table, tbody, tr, td {font-family: Roboto, 'Helvetica', 'Segoe UI', sans-serif;font-weight: 400;}</style>
				<table
				transition:fade={{duration: 200}}
				width="600"
				cellspacing="0"
				cellpadding="0"
				border="0"
				style="font-family:'Roboto', 'Helvetica', 'Segoe UI', sans-serif; initial; padding: 32px 0; font-size:13px !important; line-height: 1.2 !important;">
				<tbody>
					<tr>
						{#if $user.hasPic}
							<td width="100" style="vertical-align:top;padding:0 16px; {!loadedImage ? 'position:relative' : ''}">
								{#if loadedImage}
									<img out:fade={{duration: 200}} in:fade={{duration: 300}} src={loadedImage.src} alt="avatar" style="border-radius: 10px;border:none; width: 100px;display: inherit;height: 100px;" />
								{:else}
									<span in:fade={{duration: 200, delay: 200}} style="width: 100px;height: 100px;display: flex;align-items: center;justify-content: center;top: 0;position: absolute;">
									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" style="height: 32px; width: 32px;"><path fill="#aaa" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg>
								</span>
								{/if}
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
								<a href="https://www.solware.fr/" data-external="true" style="text-decoration:none !important;color:#075dc9;font: 500 13px Roboto, 'Helvetica', 'Segoe UI', sans-serif !important;">
									<span style="text-decoration:none;color:#075dc9;font-weight: 500 !important;">Solware</span>
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
											<a href={$user.linkedin || "https://www.linkedin.com/company/solware-auto/"} target="_blank" rel="noreferrer" data-external="true">
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
							{#if !$user.hideAnnouncement && $user.banner}
								<a transition:fade={{duration: 200}} href={$user.bannerLink.length > 0 ? $user.bannerLink : null} style="display:block; {$user.advert ? "padding-bottom: 6px;" : ""}">
									{#if loadedAnnounce}
									<img src={loadedAnnounce.src} alt="announce banner" style="width: {naturalWidth}px; height: {newHeight}px; border-radius:10px; {$user.border ? "border: 1px solid #ddd;" : ''}">
									{:else}
									<span style={"width: 100%;display: flex; align-items:center;height: 100px; justify-content:center;"}>
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" style="height: 32px; width: 32px;"><path fill="#aaa" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg>
									</span>
									{/if}
								</a>
							{/if}
							{#if $user.advert}
							<span transition:fade={{duration: 200}} style="color:#aaa;font-size:8pt;">Ce message électronique et tous les fichiers qui y sont attachés sont confidentiels et destinés uniquement à la personne ou à l'entité à qui ils sont adressés. Si vous avez reçu ce message par erreur, veuillez en informer immédiatement l'expéditeur et supprimer ce message de votre système. Tout usage, divulgation, distribution ou reproduction de ce message est interdit.</span>
							{/if}
						</td>
					</tr>
				</tbody>
			</table>
			{/if}
		</div>
	</div>
</div>