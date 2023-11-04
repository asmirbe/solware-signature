
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
			transition:fly={{ y: 0 }}
		>
			<div class="content">{notification.message}</div>
			{#if notification.icon}<i class={notification.icon} />{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.notifications {
		position: absolute;
		bottom: 20px;
		left: 20px;
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
		box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
		&.info {
			border: 1px solid #ededed;
    background: #f9fafb;
		}
		&.success {
			color: #fff;
			background-color: #1877f2;
		}
		&.warning {
			color: #fff;
			background: #fec84b;
		}
		&.danger {
			color: #fff;
			background: rgb(224, 36, 36);
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
