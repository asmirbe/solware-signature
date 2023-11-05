// store.js
import { debounce, objectsAreEqual } from "./util.js";
import { notifications } from "../component/notifications.js";
import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const isLoading = writable(false);
export const signLoading = writable(true);

const defaultValue = {
	identifiers: {
			userUniqueToken: crypto.randomUUID(),
		},
		preferences: {
			acceptRgpd: false,
			mobilePhoneCheckbox: false,
			brand: 0,
			advert: 0
	},
	personalInfo: {
			name: "Prénom Nom",
			position: "Poste",
			contact: {
					email: "solware@solware.fr",
					phone: "04 72 52 70 70",
					mobilePhone: "",
					linkedin: "",
			},
			pictureUrl: "",
	},
	features: {
			bookACall: '',
			banner: {
					visible: false,
					link: "",
					image: "",
					border: false,
			},
			previewImage: "",
	}
};

const initialValue = browser ? JSON.parse(localStorage.getItem("user")) ?? defaultValue : defaultValue;
let user = writable(initialValue);

const debouncedSaveToLocalStorage = debounce((currentValue) => {
	try {
		localStorage.setItem("user", JSON.stringify(currentValue));
	} catch (error) {
		console.error("Failed to set item in localStorage:", error);
	}
}, 300);

if (browser) {
	user.subscribe(debouncedSaveToLocalStorage);
	signLoading.set(false);
}

export const updateInlocalStore = (name, value) => {
	try {
		user.update((n) => {
			// Check for nested properties using dot notation
			const keys = name.split(".");
			if (keys.length > 1) {
				let obj = n; // Reference to the object to navigate through
				// Traverse all keys except the last one
				for (let i = 0; i < keys.length - 1; i++) {
					if (!obj[keys[i]]) {
						obj[keys[i]] = {}; // If the nested object doesn't exist, create it
					}
					obj = obj[keys[i]];
				}
				// Update the property in the nested object
				obj[keys[keys.length - 1]] = value;
				return { ...n };
			} else {
				// Update the property as before if it's not nested
				return { ...n, [name]: value };
			}
		});
		console.log("Updated", name, value);
	} catch (error) {
		console.error("Failed to update data in localStorage:", error);
	}
};

export const resetToDefault = () => {
	try {
		// user.set(defaultValue);
		user.set(Object.assign({}, defaultValue));
		notifications.info("Le formulaire est réinitialisé", 1000);
	} catch (error) {
		console.error("Failed to update data in localStorage:", error);
	}
};

export default user;
