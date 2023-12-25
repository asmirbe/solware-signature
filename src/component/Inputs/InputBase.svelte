<script>
	export let type = "text";
	export let value = "";
	export let placeholder = "";
	export let id = "";
	export let name = "";
	export let spellcheck = false;
	export let autocomplete = "off";
	export let customClass = "";
	export let inputHandler = () => {};
	export let label = ''
	// Optional: A function to format the phone number (if type='tel')
	export let formatFunction = null;

	// Handler for input event
	function handleInput(event) {
		if (type === "tel" && typeof formatFunction === "function") {
			// Pass the inputHandler to formatFunction
			formatFunction(event, inputHandler);
		} else {
			inputHandler(event.target.value);
		}
	}
</script>

{#if label.length > 0}
	 <label for={id}>{label}</label>
{/if}
<div class="input">
	<input class={customClass} {type} {value} placeholder={placeholder} {id} {name} {spellcheck} {autocomplete} on:input={handleInput} />
</div>

<style>
	/* Add some default styles or include a stylesheet */
</style>
