// store.js
import { debounce, objectsAreEqual } from "./util.js"
import { notifications } from "../component/notifications.js";
import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const isLoading = writable(false);
export const signLoading = writable(true);

const defaultValue = {
	userUniqueToken: crypto.randomUUID(),
	brand: 0,
	acceptRgpd: false,
	preview: false,
	name: "Prénom Nom",
	position: "Poste",
	email: "solware@solware.fr",
	phone: "04 72 52 70 70",
	mobilePhone: "",
	border: false,
	bookACall: '',
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
			return { ...n, [name]: value }; // Spread the old value and update the given property
		});
		console.log("Updated", name, value);
	} catch (error) {
		console.error("Failed to update data in localStorage:", error);
	}
};

export const resetToDefault = () => {
	try {
		// user.set(defaultValue);
		user.set(Object.assign({}, defaultValue))
		notifications.info("Le formulaire est réinitialisé", 1000)
	} catch (error) {
		console.error("Failed to update data in localStorage:", error);
	}
};

export default user