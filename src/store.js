// store.js
import { browser } from "$app/env";
import { writable } from "svelte/store";

const defaultValue = {
	font: "Arial",
	name: "Jean Dujardin",
	position: "Jardinier",
	email: "solware@solware.fr",
	phone: "04 72 52 70 70",
	product: "Solware Auto",
	banner: null,
	linkedin: "",
	hasPic: false,
	pictureUrl: "",
};

if (browser){
	localStorage ? true : false;
}

const initialValue = browser
	? JSON.parse(localStorage.getItem("user")) ?? defaultValue
	: defaultValue;

const user = writable(initialValue);

export const deleteFromlocalStore = (value) => {
	try {
		user.update(n => {
			n[value] = null;
			return n;
		});
		const dataJson = localStorage.getItem('user');
		const data = JSON.parse(dataJson);
		delete data[value];
		const updatedDataJson = JSON.stringify(data);
		localStorage.setItem('user', updatedDataJson);
	} catch (error) {
		console.error('Failed to update data in localStorage:', error);
	}
};

export default user;
