// store.js
import { browser } from "$app/environment";
import { writable } from "svelte/store";

const defaultValue = {
  name: "Prénom Nom",
	font: 'Arial',
  position: "Poste occupé",
  email: "",
  phone: "04 72 52 70 70",
  border: false,
  advert: false,
  banner: null,
  bannerLink: "",
	hideAnnouncement: false,
  linkedin: "",
  hasPic: false,
  pictureUrl: "",
};

if (browser) {
	localStorage ? true : false;
}

const initialValue = browser
	? JSON.parse(localStorage.getItem("user")) ?? defaultValue
	: defaultValue;

let user = writable(initialValue);
export const deleteFromlocalStore = (value) => {
	try {
		user.update(n => {
			n[value] = null;
			return n;
		});
	} catch (error) {
		console.error('Failed to update data in localStorage:', error);
	}
};

export const resetToDefault = () => {
	try {
		user.set(defaultValue);
		localStorage.setItem('user', JSON.stringify(defaultValue));
	} catch (error) {
		console.error('Failed to update data in localStorage:', error);
	}
};

export default user;
export const isLoading = writable(false);
export const welcomeModal = writable(false);
