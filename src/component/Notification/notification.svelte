<script>
	// @ts-nocheck

	import { fly, fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { fadeTranslateScale } from "$lib/util";
	import { Notification, notifications } from "./index";
	import { notificationIcon } from "$lib/constants";
	export let themes = {
		default: "default",
		success: "success",
		danger: "danger",
		warning: "warning",
		info: "info",
	};

	function handleRemove(notificationId) {
    notifications.remove(notificationId);
  }
</script>

{#if $notifications.length}
	<div class="notifications">
		{#each $notifications as notification (notification.id)}
			<div class="toast {themes[notification.type]}"
			in:fadeTranslateScale={{duration: 200, from:"bottom-left"}}
			animate:flip={{duration: 200}}
			out:fly={{ y: 10, duration: 200 }}>
				<div class="content">
					{#if notification.icon}
						<!-- <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">{@html notificationIcon[notification.type]}</svg> -->
						<!-- {@html notificationIcon[notification.type]} -->
						{@html notification.icon}
					{/if}
					{notification.message}
					<button on:click={() => handleRemove(notification.id)}>
						<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500"><path d="M20 4 4 20M4 4l16 16"></path></svg>
					</button>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	:global {
		.notifications {
			position: absolute;
			bottom: 20px;
			left: 20px;
			margin: 0 auto;
			padding: 0;
			z-index: 9999999;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			.content {
				padding-top: 0.75rem;
				padding-bottom: 0.75rem;
				padding-left: 1rem;
				padding-right: 1rem;
				gap: 0.5rem;
				display: flex;
				width: 18rem;
				font-weight: 500;
				color: inherit;
				font-size: 0.875rem;
				line-height: 1.25rem;
				svg {
					width: 1.25rem;
					height: 1.25rem;
				}
				button {
					padding: 0;
					background-color: white;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 0;
					cursor: pointer;
					margin: 0;
					margin-left: auto;
					svg {
						width: 16px;
						height: 16px;
						color: rgb(100, 116, 139);
					}
				}
			}
		}

		.toast {
			flex: 0 0 auto;
			border-radius: 0.375rem;
			transition: margin 0.2s ease-in-out;
			background: #fff;
			box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, rgba(2, 6, 23, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
			& + .toast {
				margin-top: .75rem;

			}
			&.info {
				// color: rgb(29, 78, 216);
				// background: rgb(239, 246, 255);
				svg {
					color: rgb(100, 116, 139);
				}
			}
			&.success {
				// color: rgb(21, 128, 61);
				// background: rgb(240, 253, 244);
				svg {
					color: rgb(5, 150, 105);
				}
			}
			&.warning {
				// color: rgb(161, 98, 7);
				// background: rgb(254, 252, 232);
				svg {
					color: rgb(250, 204, 21);
				}
			}
			&.danger {
				// color: rgb(185, 28, 28);
				// background: rgb(254, 242, 242);
				svg {
					color: rgb(220, 38, 38);
				}
			}
		}
	}
</style>
