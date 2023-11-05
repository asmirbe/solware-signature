<script>
	// @ts-nocheck
	import { fade } from 'svelte/transition'
	import user, {updateInlocalStore} from "$lib/store.js";
	let show = false;
	let container;
	let selected;
	export let opts = null;
	export let obj;

	function getNestedValue(object, keyString) {
			const keys = keyString.split(".");
			return keys.reduce((o, k) => (o || {})[k], object);
	}


	// Update the selected value whenever $user or opts changes
	$: selected = opts.find(opt => opt.id === getNestedValue($user, obj))?.name || opts[0]?.name || "Select...";


	function onWindowClick(e) {
		if (container.contains(e.target) == false) show = false;
	}

	function updateNestedProperty(obj, path, value) {
		const paths = path.split(".");
		let current = obj;
		for (let i = 0; i < paths.length - 1; i++) {
			if (!current[paths[i]]) {
				current[paths[i]] = {};
			}
			current = current[paths[i]];
		}
		current[paths[paths.length - 1]] = value;
	}

	function handleClick(params) {
    show = false;
    updateInlocalStore(obj, params.id);
}
</script>

<svelte:window on:click={onWindowClick} />

<div class="dropdown" bind:this={container}>
	<button class="dropdown-toggle {show === true ? 'open' : ''}" on:click={() => (show = !show)}>
		{selected}
		<svg class="icon" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
				fill="currentColor"
			/>
		</svg>
	</button>
	{#if show}
		<div transition:fade={{duration:100}} class="dropdown-menu">
			{#each opts as opt}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span
					on:click={() => {
						handleClick(opt);
					}}
				>
				<svg class={`icon ${opt.id === getNestedValue($user, obj) ? "visible" : ""}`} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
							fill="currentColor"
						/>
					</svg>
					{opt.name}
					{#if opt.badge}
					<div class={`badge -${opt.badgeColor}`}>
						<svg class="dot" fill="currentColor" viewBox="0 0 8 8">
							<circle cx="4" cy="4" r="3"></circle>
						</svg>
						{opt.badge}
					</div>
					{/if}
				</span>
			{/each}
		</div>
	{/if}
</div>
