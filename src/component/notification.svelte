
<script>
	// @ts-nocheck

	import { fly } from "svelte/transition";
	import { notifications } from "./notifications.js";

	export let themes = {
		default: "default",
		success: "success",
		danger: "danger",
		warning: "warning",
		info: "info",
	};
</script>

<div class="notifications">
	{#each $notifications as notification (notification.id)}
		<div
			class="toast {themes[notification.type]}"
			transition:fly={{ y: -30 }}
		>
			<div class="content">{notification.message}</div>
			{#if notification.icon}<i class={notification.icon} />{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.notifications {
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0;
		z-index: 9999999;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		pointer-events: none;
	}

	.toast {
		flex: 0 0 auto;
		border-radius: 8px;
		margin-bottom: 10px;
		box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
		&.success {
			color: #fff;
			background-color: #1877f2;
		}
		&.warning {
			color: #fff;
			background: #fec84b;
		}
		&.error {
			color: #fff;
			background: #b42318;
		}
	}

	.content {
		padding: 12px 16px;
		gap: 12px;
		display: block;
		font-size: 14px;
		font-family: "Inter", sans-serif;
		color: inherit;
		font-weight: 500;
	}
</style>
