// store.js
import { browser } from "$app/environment";
import { writable } from "svelte/store";

const defaultValue = {
	preview: false,
	saved: false,
	name: "Prénom Nom",
	position: "Poste",
	email: "solware@solware.fr",
	phone: "04 72 52 70 70",
	mobilePhone: "",
	border: false,
	bookACall: false,
	advert: false,
	banner: null,
	mobilePhoneCheckbox: false,
	bannerLink: "",
	hideAnnouncement: true,
	linkedin: "",
	pictureUrl: "",
};

const initialValue = browser ? JSON.parse(localStorage.getItem("user")) ?? defaultValue : defaultValue;

let user = writable(initialValue);

if (browser) {
	user.subscribe((currentValue) => {
		try {
			localStorage.setItem("user", JSON.stringify(currentValue));
		} catch (error) {
			console.error("Failed to set item in localStorage:", error);
		}
	});
}

export const updateInlocalStore = (name, value) => {
	try {
		user.update((n) => {
			return { ...n, [name]: value }; // Spread the old value and update the given property
		});
		console.log("Updated", name, value);
	} catch (error) {
		console.error("Failed to update data in localStorage:", error);
	}
};

export const resetToDefault = () => {
	try {
		user.set(defaultValue);
		console.log("Store.js ", defaultValue);
		// localStorage.setItem('user', JSON.stringify(defaultValue));
	} catch (error) {
		console.error("Failed to update data in localStorage:", error);
	}
};

export default user;
