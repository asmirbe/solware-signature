<script>
	import { tooltip } from "$components/Tooltip";
	export let type = "text";
	export let value = "";
	export let placeholder = "";
	export let id = "";
	export let name = "";
	export let spellcheck = true;
	export let autocomplete = "on";
	export let customClass = "";
	export let inputHandler = () => {};
	export let label = "";
	export let canHide = false;

	// Handler for input event
	function handleInput(event) {
		inputHandler(event.target.value);
	}
</script>

{#if label.length > 0}
	<label for={id}>{label}</label>
{/if}
<div class="input">
	<div class="link">https://</div>
	<input class={customClass} {type} {value} {placeholder} {id} {name} {spellcheck} {autocomplete} on:input={handleInput} />
	{#if canHide}
		<!-- <div class="hide">
		<button
			use:tooltip
			title="Afficher ou cacher l'annonce"
			class="btn -secondary -square"
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
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
				</svg>
			{/if}
		</button>
	</div> -->
	{/if}
</div>

<style lang="scss">
	.input {
		position: relative;
		display: flex;
		border: 1px solid #d0d5dd;
		border-radius: 0.375rem;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		outline-offset: 2px;
		&:focus-within {
			outline: 2px solid #34d399;
		}
		.link {
			font-size: 0.875rem;
			line-height: 1.25rem;
			align-items: center;
			display: flex;
			color: #667085;
			padding-left: 0.75rem;
		}
		.hide {
			display: flex;
			padding: 4px;
			align-items: center;
			justify-content: center;
		}
	}
	input[type="text"] {
		border: 0;
		padding-left: 0.25rem;
		padding-right: 0.75rem;
		// padding-right: 0.25rem;
		outline: none !important;
	}
</style>
