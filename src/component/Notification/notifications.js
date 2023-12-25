import { writable, derived } from "svelte/store";

const TIMEOUT = 3000;

function createNotificationStore(timeout) {
	const _notifications = writable([]);

	function send(message, type = "default", timeout = TIMEOUT, icon) {
    const id = createId();
    _notifications.update((state) => {
      return [...state, { id, type, message, timeout, icon }];
    });

    // Set a timeout to auto-remove the notification after "timeout" duration
    if (timeout) {
      setTimeout(() => {
        remove(id);
      }, timeout);
    }
  }

	function remove(id) {
    _notifications.update((state) => {
      return state.filter((notification) => notification.id !== id);
    });
  }

	const notifications = derived(_notifications, ($_notifications) => $_notifications);

	const { subscribe } = notifications;

	return {
		subscribe: notifications.subscribe,
		send,
		remove,
		default: (msg, timeout, icon) => send(msg, "default", timeout, icon),
		danger: (msg, timeout, icon) => send(msg, "danger", timeout, icon),
		warning: (msg, timeout, icon) => send(msg, "warning", timeout, icon),
		info: (msg, timeout, icon) => send(msg, "info", timeout, icon),
		success: (msg, timeout, icon) => send(msg, "success", timeout, icon),
	};
}

function createId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export const notifications = createNotificationStore();
