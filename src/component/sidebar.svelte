<script>
	import { browser } from "$app/environment";
	import user, { updateInlocalStore, resetToDefault } from "$lib/store";
	import { notifications } from "$components/notifications";
	import Notification from "$components/notification.svelte";
	import Dropdown from "$components/dropdown.svelte";
	import { tooltip } from "$components/tooltip";
	import Image from "$components/image.svelte";
	import { langOptions } from "$lib/constants";
	import { formatPhone, loadImage, checkImageUrl, getBase64 } from "$lib/util";
	import { isLoading, signLoading } from "$lib/store";

	// Variables
	let files,
		fileInput,
		showMore = false;

	async function saveData() {
		updateInlocalStore("saved", true);
		notifications.success("Profil sauvegardé", 1000);
	}

	function removeData() {
		resetToDefault();
	}

	function handleSuccess(e) {
		notifications.success("Copié dans le presse-papier", 1000);
		e.clearSelection();
	}

	async function selectImage(image, input) {
		if (!image) return;
		const base64 = await getBase64(image);
		updateInlocalStore("previewImage", base64);
	}

	async function uploadFunction() {
		if (!$user.previewImage) return;
		isLoading.update(current => !current);
		const response = await fetch("api/upload", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ fullname: $user.name, avatar: $user.previewImage, token: $user.userUniqueToken }),
		});

		const result = await response.json();
		updateInlocalStore("pictureUrl", result.secure_url);
		isLoading.update(current => false);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		console.log("handle");
		if ($user.previewImage) {
			uploadFunction();
		}
	}

	function removeFile() {
		updateInlocalStore("pictureUrl", null);
		updateInlocalStore("previewImage", null);
		fileInput.value = "";
	}
</script>

<aside class="form-container">
	<a href="/" class="logo">
		<svg width="1094" height="164" viewBox="0 0 1094 164" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M435.286 22V3.26626H428V0H446.381V3.26626H439.04V22H435.286ZM448.893 22V0H454.413L460.098 17.573L465.591 0H471V22H467.578V3.5362L461.782 22H458.387L452.343 3.26626V22H448.893Z" fill="black" />
			<path d="M62.2446 48.2302C48.0886 48.2302 32.9668 56.5792 29.1446 68.5792V50.9364H0V160.645H30.81V95.6942C31.0182 84.4527 40.5943 75.7094 52.8767 75.7094C65.3672 75.7094 74.5269 83.62 74.5269 97.5678V160.645H105.129V91.5307C105.129 65.9251 88.4747 48.2302 62.2446 48.2302Z" fill="black" />
			<path
				d="M150.812 115.263H233.041C233.458 112.556 233.666 108.393 233.666 103.605C233.666 76.1257 212.64 48.4383 177.25 48.4383C145.816 48.4383 120.627 74.044 120.627 105.895C120.627 138.578 143.734 163.351 179.332 163.351C206.187 163.351 220.343 152.318 228.878 139.828L205.354 124.214C200.566 132.958 193.696 137.746 180.165 137.746C165.592 137.746 154.351 129.627 150.812 115.263ZM150.396 95.0697C153.518 80.0811 163.927 71.754 178.083 71.754C192.239 71.754 201.815 80.7056 204.73 95.0697H150.396Z"
				fill="black"
			/>
			<path d="M349.317 160.645L307.89 105.479L348.485 50.9364H315.801L291.445 83.62L266.88 50.9364H232.739L272.709 104.021L229.824 160.645H262.508L289.155 125.88L315.385 160.645H349.317Z" fill="black" />
			<path d="M410.233 160.645H428.345V133.79H416.687C405.862 133.79 399.824 127.545 399.824 115.887V77.1666H427.512V50.9364H400.865V22H370.888V39.0704C370.888 46.9811 367.141 50.9364 359.647 50.9364H350.279V77.1666H369.014V119.634C369.014 144.407 382.962 160.645 410.233 160.645Z" fill="black" />
			<path
				d="M530.213 98.3438V101.719H497.658C498.01 105.258 499.193 108.023 501.209 110.016C503.248 112.008 505.979 113.004 509.4 113.004C512.377 113.004 514.896 112.336 516.959 111C519.045 109.664 520.51 107.812 521.354 105.445L529.545 107.625C528.35 111.82 525.947 115.125 522.338 117.539C518.752 119.953 514.393 121.16 509.26 121.16C502.861 121.16 497.787 119.156 494.037 115.148C490.311 111.141 488.447 105.867 488.447 99.3281C488.447 92.8359 490.416 87.5273 494.354 83.4023C498.314 79.2773 503.494 77.2148 509.893 77.2148C513.104 77.2148 515.998 77.7539 518.576 78.832C521.154 79.8867 523.275 81.375 524.939 83.2969C526.627 85.1953 527.916 87.4219 528.807 89.9766C529.697 92.5312 530.166 95.3203 530.213 98.3438ZM509.471 84.8789C506.33 84.8789 503.693 85.8047 501.561 87.6562C499.451 89.5078 498.174 91.957 497.729 95.0039H520.932C520.51 91.8164 519.314 89.332 517.346 87.5508C515.377 85.7695 512.752 84.8789 509.471 84.8789ZM589.029 77.2148C593.951 77.2148 597.643 78.7852 600.104 81.9258C602.564 85.043 603.795 89.4727 603.795 95.2148V120H594.443V95.9531C594.443 89.0859 591.607 85.6523 585.936 85.6523C582.959 85.6523 580.58 86.6016 578.799 88.5C577.041 90.3984 576.162 93.0234 576.162 96.375V120H566.775V95.9531C566.775 89.0859 563.904 85.6523 558.162 85.6523C555.209 85.6523 552.842 86.6016 551.061 88.5C549.303 90.3984 548.424 93.0234 548.424 96.375V120H539.072V78.375H546.42L548.143 84.0703C549.502 81.8438 551.295 80.1445 553.521 78.9727C555.771 77.8008 558.326 77.2148 561.186 77.2148C567.678 77.2148 572.084 79.9336 574.404 85.3711C575.764 82.7227 577.697 80.707 580.205 79.3242C582.736 77.918 585.678 77.2148 589.029 77.2148ZM632.307 77.2148C638.564 77.2148 643.264 78.7617 646.404 81.8555C649.568 84.9492 651.15 89.2852 651.15 94.8633V120H643.803L642.01 113.953C640.322 116.297 638.119 118.09 635.4 119.332C632.705 120.551 629.729 121.16 626.471 121.16C621.83 121.16 618.232 119.977 615.678 117.609C613.123 115.242 611.846 112.172 611.846 108.398C611.846 106.57 612.162 104.895 612.795 103.371C613.451 101.848 614.424 100.477 615.713 99.2578C617.025 98.0391 618.783 97.0898 620.986 96.4102C623.213 95.7305 625.779 95.3906 628.686 95.3906C633.373 95.3906 637.744 96.1758 641.799 97.7461V95.3906C641.799 92.0859 640.932 89.5781 639.197 87.8672C637.486 86.1562 635.037 85.3008 631.85 85.3008C626.67 85.3008 623.436 87.75 622.146 92.6484L613.428 90.5391C615.701 81.6562 621.994 77.2148 632.307 77.2148ZM628.826 113.602C630.912 113.602 632.904 113.238 634.803 112.512C636.725 111.762 638.354 110.625 639.689 109.102C641.025 107.555 641.729 105.785 641.799 103.793C638.377 102.551 634.486 101.93 630.127 101.93C624.174 101.93 621.197 103.875 621.197 107.766C621.197 109.758 621.9 111.234 623.307 112.195C624.713 113.133 626.553 113.602 628.826 113.602ZM666.654 73.1367C664.732 73.1367 663.197 72.6094 662.049 71.5547C660.9 70.5 660.326 69.082 660.326 67.3008C660.326 65.543 660.9 64.1484 662.049 63.1172C663.197 62.0625 664.732 61.5352 666.654 61.5352C668.506 61.5352 670.006 62.0625 671.154 63.1172C672.326 64.1719 672.912 65.5664 672.912 67.3008C672.912 69.082 672.326 70.5 671.154 71.5547C670.006 72.6094 668.506 73.1367 666.654 73.1367ZM661.979 120V78.375H671.33V120H661.979ZM682.65 120V62.4141H692.002V120H682.65ZM738.021 121.16C732.443 121.16 727.979 120.094 724.627 117.961C721.299 115.828 719.131 112.734 718.123 108.68L726.771 106.887C728.084 111.363 731.975 113.602 738.443 113.602C741.467 113.602 743.787 113.156 745.404 112.266C747.045 111.375 747.865 110.062 747.865 108.328C747.865 107.25 747.549 106.348 746.916 105.621C746.283 104.895 745.428 104.344 744.35 103.969C743.295 103.594 742.076 103.289 740.693 103.055C739.311 102.82 737.857 102.598 736.334 102.387C734.811 102.176 733.287 101.941 731.764 101.684C730.24 101.402 728.787 100.992 727.404 100.453C726.021 99.8906 724.791 99.1992 723.713 98.3789C722.658 97.5352 721.814 96.4102 721.182 95.0039C720.549 93.5742 720.232 91.8984 720.232 89.9766C720.232 86.1562 721.791 83.0742 724.908 80.7305C728.025 78.3867 732.268 77.2148 737.635 77.2148C742.885 77.2148 747.104 78.3281 750.291 80.5547C753.502 82.7578 755.529 85.8047 756.373 89.6953L747.654 91.5586C747.139 89.3555 745.979 87.6797 744.174 86.5312C742.369 85.3828 740.025 84.8086 737.143 84.8086C734.635 84.8086 732.689 85.207 731.307 86.0039C729.924 86.8008 729.232 87.9375 729.232 89.4141C729.232 90.4453 729.549 91.3008 730.182 91.9805C730.814 92.6602 731.658 93.1875 732.713 93.5625C733.791 93.9141 735.021 94.207 736.404 94.4414C737.787 94.6758 739.24 94.8984 740.764 95.1094C742.311 95.3203 743.846 95.5781 745.369 95.8828C746.916 96.1641 748.381 96.5977 749.764 97.1836C751.146 97.7461 752.365 98.4609 753.42 99.3281C754.498 100.195 755.354 101.355 755.986 102.809C756.619 104.262 756.936 105.961 756.936 107.906C756.936 112.031 755.283 115.277 751.979 117.645C748.674 119.988 744.021 121.16 738.021 121.16ZM770.365 73.1367C768.443 73.1367 766.908 72.6094 765.76 71.5547C764.611 70.5 764.037 69.082 764.037 67.3008C764.037 65.543 764.611 64.1484 765.76 63.1172C766.908 62.0625 768.443 61.5352 770.365 61.5352C772.217 61.5352 773.717 62.0625 774.865 63.1172C776.037 64.1719 776.623 65.5664 776.623 67.3008C776.623 69.082 776.037 70.5 774.865 71.5547C773.717 72.6094 772.217 73.1367 770.365 73.1367ZM765.689 120V78.375H775.041V120H765.689ZM819.549 78.0938H826.896V116.625C826.896 122.109 824.998 126.398 821.201 129.492C817.404 132.609 812.096 134.168 805.275 134.168C794.541 134.168 787.92 130.664 785.412 123.656L793.85 120.949C795.818 124.535 799.58 126.328 805.135 126.328C808.955 126.328 811.979 125.449 814.205 123.691C816.432 121.934 817.545 119.426 817.545 116.168V111.949C814.357 116.543 809.482 118.84 802.92 118.84C797.412 118.84 792.865 116.953 789.279 113.18C785.693 109.406 783.9 104.379 783.9 98.0977C783.9 94.957 784.393 92.0742 785.377 89.4492C786.385 86.8008 787.744 84.5977 789.455 82.8398C791.166 81.0586 793.182 79.6758 795.502 78.6914C797.846 77.707 800.342 77.2148 802.99 77.2148C805.967 77.2148 808.744 77.7539 811.322 78.832C813.924 79.8867 816.068 81.6094 817.756 84L819.549 78.0938ZM796.557 107.062C798.689 109.359 801.572 110.508 805.205 110.508C808.838 110.508 811.803 109.43 814.1 107.273C816.396 105.117 817.545 102.059 817.545 98.0977C817.545 94.1133 816.396 91.0781 814.1 88.9922C811.826 86.9062 808.861 85.8633 805.205 85.8633C801.572 85.8633 798.689 87 796.557 89.2734C794.447 91.5469 793.393 94.4883 793.393 98.0977C793.393 101.777 794.447 104.766 796.557 107.062ZM861.49 77.2148C866.811 77.2148 870.83 78.8203 873.549 82.0312C876.268 85.2422 877.627 89.7422 877.627 95.5312V120H868.275V96.375C868.275 92.6953 867.42 89.9883 865.709 88.2539C863.998 86.5195 861.607 85.6523 858.537 85.6523C855.256 85.6523 852.596 86.625 850.557 88.5703C848.541 90.5156 847.533 93.0938 847.533 96.3047V120H838.182V78.375H845.529L847.252 84.1406C848.752 81.9141 850.709 80.2031 853.123 79.0078C855.537 77.8125 858.326 77.2148 861.49 77.2148ZM906.104 77.2148C912.361 77.2148 917.061 78.7617 920.201 81.8555C923.365 84.9492 924.947 89.2852 924.947 94.8633V120H917.6L915.807 113.953C914.119 116.297 911.916 118.09 909.197 119.332C906.502 120.551 903.525 121.16 900.268 121.16C895.627 121.16 892.029 119.977 889.475 117.609C886.92 115.242 885.643 112.172 885.643 108.398C885.643 106.57 885.959 104.895 886.592 103.371C887.248 101.848 888.221 100.477 889.51 99.2578C890.822 98.0391 892.58 97.0898 894.783 96.4102C897.01 95.7305 899.576 95.3906 902.482 95.3906C907.17 95.3906 911.541 96.1758 915.596 97.7461V95.3906C915.596 92.0859 914.729 89.5781 912.994 87.8672C911.283 86.1562 908.834 85.3008 905.646 85.3008C900.467 85.3008 897.232 87.75 895.943 92.6484L887.225 90.5391C889.498 81.6562 895.791 77.2148 906.104 77.2148ZM902.623 113.602C904.709 113.602 906.701 113.238 908.6 112.512C910.521 111.762 912.15 110.625 913.486 109.102C914.822 107.555 915.525 105.785 915.596 103.793C912.174 102.551 908.283 101.93 903.924 101.93C897.971 101.93 894.994 103.875 894.994 107.766C894.994 109.758 895.697 111.234 897.104 112.195C898.51 113.133 900.35 113.602 902.623 113.602ZM959.471 108.188L967.1 110.719C966.186 114.07 964.475 116.648 961.967 118.453C959.482 120.258 956.295 121.16 952.404 121.16C947.717 121.16 944.107 119.848 941.576 117.223C939.045 114.574 937.779 110.777 937.779 105.832V86.4609H931.24V78.375H938.377L940.311 69.5859H947.166V78.375H964.006V86.4609H947.166V105.832C947.166 108.082 947.682 109.816 948.713 111.035C949.744 112.254 951.197 112.863 953.072 112.863C956.213 112.863 958.346 111.305 959.471 108.188ZM1001.9 78.375H1011.26V120H1003.91L1002.12 114.023C1000.66 116.344 998.717 118.113 996.279 119.332C993.865 120.551 991.064 121.16 987.877 121.16C982.674 121.16 978.783 119.602 976.205 116.484C973.65 113.344 972.373 108.902 972.373 103.16V78.375H981.76V102.809C981.76 109.465 984.736 112.793 990.689 112.793C993.947 112.793 996.631 111.785 998.74 109.77C1000.85 107.73 1001.9 105.07 1001.9 101.789V78.375ZM1045.01 77.2148C1046.37 77.2148 1047.78 77.3672 1049.26 77.6719L1048.24 86.3906C1046.67 85.9922 1044.94 85.793 1043.04 85.793C1039.94 85.793 1037.32 86.8945 1035.16 89.0977C1033.03 91.3008 1031.96 94.207 1031.96 97.8164V120H1022.61V78.375H1029.96L1031.75 84.5625C1033.18 82.1953 1035.02 80.3789 1037.27 79.1133C1039.54 77.8477 1042.12 77.2148 1045.01 77.2148ZM1093.13 98.3438V101.719H1060.58C1060.93 105.258 1062.12 108.023 1064.13 110.016C1066.17 112.008 1068.9 113.004 1072.32 113.004C1075.3 113.004 1077.82 112.336 1079.88 111C1081.97 109.664 1083.43 107.812 1084.28 105.445L1092.47 107.625C1091.27 111.82 1088.87 115.125 1085.26 117.539C1081.67 119.953 1077.31 121.16 1072.18 121.16C1065.78 121.16 1060.71 119.156 1056.96 115.148C1053.23 111.141 1051.37 105.867 1051.37 99.3281C1051.37 92.8359 1053.34 87.5273 1057.28 83.4023C1061.24 79.2773 1066.42 77.2148 1072.81 77.2148C1076.03 77.2148 1078.92 77.7539 1081.5 78.832C1084.08 79.8867 1086.2 81.375 1087.86 83.2969C1089.55 85.1953 1090.84 87.4219 1091.73 89.9766C1092.62 92.5312 1093.09 95.3203 1093.13 98.3438ZM1072.39 84.8789C1069.25 84.8789 1066.62 85.8047 1064.48 87.6562C1062.37 89.5078 1061.1 91.957 1060.65 95.0039H1083.85C1083.43 91.8164 1082.24 89.332 1080.27 87.5508C1078.3 85.7695 1075.67 84.8789 1072.39 84.8789Z"
				fill="black"
			/>
		</svg>
	</a>
	<div class="content">
		<h1>Générateur de signature</h1>
		<div class="field">
			<label for="name">Prénom et Nom</label>
			<input type="text" spellcheck="false" name="fullname" autocomplete="off" id="name" placeholder="Prénom et nom" bind:value={$user.name} />
		</div>
		<div class="field">
			<label>Image</label>
			<!-- {#if $user.previewImage}
			<div class="preview-avatar">
				<img src={$user.previewImage} alt={`Picture of ${$user.name}`} width={62} height={62} style="border-radius:10px;">
			</div>
			{/if} -->
			<div class="input-file {$user.pictureUrl ? 'active' : ''}">
				<div class="inline-btn">
					<input tabindex="-1" id="uploadFile" name="avatar" bind:files type="file" accept=".png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.jfif,.pjpeg,.pjp,.avif" bind:this={fileInput} on:change={(e) => selectImage(files[0], e.target)} />
					<button for="uploadFile" class="btn -secondary" type="button" on:click={() => fileInput.click()}>
						{$user.pictureUrl || $user.previewImage ? "Remplacer" : "Choisir"}
					</button>
					{#if $user.pictureUrl || $user.previewImage}
						<button use:tooltip title="Supprimer l'image" class="btn -imagepreview" on:click={removeFile}>
							<img src={$user.previewImage} alt={`Picture of ${$user.name}`} />
							<svg class="close" aria-hidden="true" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
						</button>
					{/if}
					<!-- {#if $user.pictureUrl || $user.previewImage}
						<button
							use:tooltip
							title="Supprimer l'image"
							class="btn -secondary -remove -square"
							on:click={() => {
								notifications.success("Image supprimé, pensez a sauvegarder", 1000);
								updateInlocalStore("pictureUrl", null);
								updateInlocalStore("previewImage", null);
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
								/>
							</svg>
						</button>
					{/if} -->
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
			<label for="phone">Téléphone entreprise</label>
			<input
				type="tel"
				size="10"
				placeholder="Numéro téléphone"
				id="phone"
				on:input={(event) => {
					formatPhone(event, (newValue) => user.update((currUser) => ({ ...currUser, phone: newValue })));
				}}
				value={$user.phone}
			/>
		</div>
		<div class="field">
			<div class="field -inline">
				<label for="phoneMobile">Téléphone mobile</label>
				<input id="border" bind:checked={$user.mobilePhoneCheckbox} type="checkbox" class="checkbox switch" />
			</div>
			{#if $user.mobilePhoneCheckbox}
				<input
					type="tel"
					size="10"
					placeholder="Numéro téléphone"
					id="phoneMobile"
					on:input={(event) => {
						formatPhone(event, (newValue) => user.update((currUser) => ({ ...currUser, mobilePhone: newValue })));
					}}
					value={$user.mobilePhone}
				/>
			{/if}
		</div>
		<!-- Relative -->
		<div>
			<div class="separator" />
			<div>
				<h2>Plus d'options</h2>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<div class="field">
					<label for="linkedin">LinkedIn personnel</label>
					<input type="text" spellcheck="false" autocomplete="off" id="linkedin" placeholder="Lien de votre LinkedIn" bind:value={$user.linkedin} />
				</div>
				<div class="field">
					<label for="BookACall">Réserver un appel</label>
					<input type="text" placeholder="Lien du calendrier en ligne" id="BookACall" bind:value={$user.bookACall} />
				</div>
				<fieldset class="field fieldset">
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
									$user.hideAnnouncement = !$user.hideAnnouncement;
								}}
							>
								{#if $user.hideAnnouncement}
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
							<input type="text" spellcheck="false" autocomplete="off" bind:value={$user.banner} placeholder="Lien de l'image de votre bannière" />
						</div>
					</div>
					<div class="field">
						<label for="bannerLink">Lien internet de l'annonce</label>
						<input type="text" disabled={!$user.banner} bind:value={$user.bannerLink} id="bannerLink" placeholder="Lien d'annonce" />
					</div>
					<div class="field -inline">
						<label for="border">Contour</label>
						<input disabled={!$user.banner} id="border" bind:checked={$user.border} type="checkbox" class="checkbox switch" />
					</div>
				</fieldset>
				<div class="field">
					<label for="advert">Avertissement de confidentialité</label>
					<Dropdown opts={langOptions} obj="advert" />
				</div>
			</div>
		</div>
	</div>
	<footer>
		<div class="buttons-group">
			<div class="field -inline -rgpd" use:tooltip title="En soumettant ce formulaire, j'accepte que les informations saisies soient exploitées dans le cadre de la démo et dfe la relation commerciale qui peut en découler.">
				<input bind:checked={$user.acceptRgpd} id="rgpd" type="checkbox" />
				<label for="rgpd">J'accepte les conditions général d'utilisation.</label>
			</div>
			<button class="btn -black" on:click={handleSubmit}>Créer la signature</button>
			<div class="inline-btn">
				<button on:click={removeData} class="copyToClipboard btn -secondary" type="button">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
					</svg>
					Réinitialiser
				</button>
			</div>
		</div>
		<!-- <div class="desc">
				<div class="head">
					<span class="news">
						<svg class="b7Lf_ucBvHbZEidPjF8t wikskPDYEBn0nlvDss8h kbeH5ty3CtPKxXm5TXph eVNhx7m5tjSVbfYQzDdT" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
								clip-rule="evenodd"
							/>
						</svg>
						New update
					</span>
					<button class="btn -square -circle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg></button>
				</div>
				<p>Veuillez remplir les informations demandées et coller le contenu dans l'espace signature électronique d'Outlook.</p>
				<p>Ce site a été créé par Asmir Belkic pour Solware. Si vous avez des questions ou une demande, n'hésitez pas à me contacter par Teams.</p>
			</div> -->

		<!-- <a href="https://teams.microsoft.com/l/chat/0/0?users=abelkic@solware.fr" class="btn -secondary">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
				</svg>
				Me contacter
			</a> -->
	</footer>
</aside>
