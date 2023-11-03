<script>
	// @ts-nocheck
	import user from "$lib/store.js";
	let show = false;
	let container;
	let selected;

	export let opts = null;
	export let obj;

	// Update the selected value whenever $user or opts changes
	$: selected = opts.find(opt => opt.id === $user[obj])?.name || opts[0]?.name || 'Select...';

	function onWindowClick(e) {
		if (container.contains(e.target) == false)
			show = false;
	}

	function handleClick(params) {
		show = false;
		user.update(n => {
			let x = obj;
			n[x] = params.id;
			return n;
		});
	}
</script>

<svelte:window on:click={onWindowClick} />

<div class="dropdown" bind:this={container}>
	<button class="dropdown-toggle {show === true ? 'open' : ''}" on:click={() => show = !show }>{selected}</button>
	{#if show}
		<div class="dropdown-menu">
			{#each opts as opt}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span on:click={() => {handleClick(opt)}}>{opt.name}
				{#if opt.id === $user[obj]}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="#2e90fa" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				{/if}
				</span>
			{/each}
		</div>
	{/if}
</div>