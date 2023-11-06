<script>
	// @ts-nocheck

	import { fly } from "svelte/transition";
	import { Notification, notifications } from "./index";
	import { notificationIcon } from "$lib/constants";
	export let themes = {
		default: "default",
		success: "success",
		danger: "danger",
		warning: "warning",
		info: "info",
	};
</script>

{#if $notifications.length}
	<div class="notifications">
		{#each $notifications as notification (notification.id)}
			<div class="toast {themes[notification.type]}" transition:fly={{ y: 0 }}>
				<div class="content">
					<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">{@html notificationIcon[notification.type]}</svg>
					{notification.message}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.notifications {
		position: absolute;
		bottom: 20px;
		left: 20px;
		margin: 0 auto;
		padding: 0;
		gap: 0.75rem;
		z-index: 9999999;
		display: flex;
		flex-direction: column;
	}

	.toast {
		flex: 0 0 auto;
		border-radius: 0.375rem;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
		&.info {
			color: rgb(29, 78, 216);
			background: rgb(239, 246, 255);
			svg {
				color: rgb(96, 165, 250);
			}
		}
		&.success {
			color: rgb(21, 128, 61);
			background: rgb(240, 253, 244);
			svg {
				color:rgb(74, 222, 128);
			}
		}
		&.warning {
			color: rgb(161, 98, 7);
			background: rgb(254, 252, 232);
			svg {
				color: rgb(250, 204, 21);
			}
		}
		&.danger {
			color: rgb(185, 28, 28);
			background: rgb(254, 242, 242);
			svg {
				color: rgb(248, 113, 113);
			}
		}
	}

	.content {
		padding: 1rem;
		gap:0.75rem;
		display: flex;
		color: inherit;
		font-size: 0.875rem;
    line-height: 1.25rem;
		svg {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
</style>
