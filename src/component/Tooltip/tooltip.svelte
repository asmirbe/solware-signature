<script>
	import "./style.scss";
	export let text = "";
</script>

<div class="tooltip">
	<slot />
	<span class="tooltip-text">{text}</span>
</div>