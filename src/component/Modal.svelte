<script>
	import { fade } from "svelte/transition";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div transition:fade={{ duration: 200 }} on:click|self class="modal">
		<slot />
</div>

<style lang="scss">
	.modal {
		display: inline-block;
		overflow: hidden;
		position: absolute;
		left: 0;
		top: 0;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-bottom: 1rem;
		padding-top: 1.25rem;
		border-radius: 0.5rem;
		text-align: left;
		margin: 1rem;
		vertical-align: bottom;
		background-color: #ffffff;
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 300ms;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		@media (min-width: 640px) {
			padding: 1.5rem;
			width: 100%;
			max-width: 24rem;
			vertical-align: middle;
		}
	}
	@keyframes zoom {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
