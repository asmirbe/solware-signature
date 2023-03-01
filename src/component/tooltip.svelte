<script>
	export let text = "";
</script>

<div class="tooltip">
	<slot />
	<span class="tooltip-text">{text}</span>
</div>

<style lang="scss">
	$primary: #101828;
	.tooltip {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		.tooltip-text {
			visibility: hidden;
			opacity: 0;
			width: auto;
			background-color: $primary;
			color: #fff;
			text-align: center;
			border-radius: 8px;
			white-space: nowrap;
			padding: 8px 12px;
			position: absolute;
			z-index: 1;
			bottom: 150%;
			transition: opacity 0.3s;
			&::after {
				content: "";
				position: absolute;
				top: 100%;
				left: 50%;
				margin-left: -5px;
				border-width: 5px;
				border-style: solid;
				border-color: $primary transparent transparent transparent;
			}
		}
		&:hover .tooltip-text {
			visibility: visible;
			opacity: 1;
		}
	}


</style>
