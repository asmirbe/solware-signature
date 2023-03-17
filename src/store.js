// store.js
import { browser } from "$app/environment";
import { writable } from "svelte/store";

const defaultValue = {
  name: "Prénom Nom",
  position: "Poste",
  email: "solware@solware.fr",
  phone: "04 72 52 70 70",
  border: false,
  advert: false,
  banner: null,
  bannerLink: "",
	hideAnnouncement: true,
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
		// const dataJson = localStorage.getItem('user');
		// const data = JSON.parse(dataJson);
		// delete data[value];
		// const updatedDataJson = JSON.stringify(data);
		// localStorage.setItem('user', updatedDataJson);
	} catch (error) {
		console.error('Failed to update data in localStorage:', error);
	}
};

export const resetToDefault = () => {
	// console.log(defaultValue);
	try {
		user.set(defaultValue);
		localStorage.setItem('user', JSON.stringify(defaultValue));
	} catch (error) {
		console.error('Failed to update data in localStorage:', error);
	}
};

export default user;
export const isLoading = writable(false);
export const isReady = writable(false);
