import { fade, slide, fly } from "svelte/transition";
import { cubicOut } from "svelte/easing";
import user from "./store.js";

export function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

export const formatPhone = (e, userOptionSetter) => {
  let value = e.target.value;
  // Remove all non-numeric characters
  const numbersOnly = value.replace(/\D/g, "");

  // Split the number string into groups of 2 and join them with spaces
  const formatted = numbersOnly.match(/.{1,2}/g)?.join(" ") || "";

  // Call the userOptionSetter function with the formatted number
  userOptionSetter(formatted);
};


export const removeSpaces = (str) => str.replace(/\s/g, "");

// get base64 from image
export function getBase64(image) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

export function objectsAreEqual(objA, objB) {
	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) return false;

	for (let key of keysA) {
		if (objA[key] !== objB[key]) return false;
	}

	return true;
}

export function loadImage(img, onLoad, onError) {
	img.onload = () => {
		onLoad(img);
		console.log("Image loaded!");
	};
	img.onerror = () => {
		onError(img);
	};
	img.src = img.dataset.src;
}

export function checkImageUrl(url) {
	const validFormats = ["jpeg", "jpg", "gif", "png", "webp", "bmp", "tiff"];
	const pattern = new RegExp(`^https?://.+\\.(${validFormats.join("|")})$`, "i");
	return pattern.test(url);
}

export function deepClone(obj) {
	if (obj === null) return null;
	if (typeof obj !== "object") return obj;
	if (obj instanceof Array) return obj.map(deepClone);
	const cloned = {};
	for (const key in obj) {
		cloned[key] = deepClone(obj[key]);
	}
	return cloned;
}

export function fadeSlide(node, options) {
	const slideTrans = slide(node, options);
	return {
		duration: options.duration,
		css: (t) => `
			${slideTrans.css(t)}
			opacity: ${t};
		`,
	};
}

export function fadeTranslateScale(node, options) {
	// Set default 'from' direction to 'top' if not provided
	const fromDirection = options.from || "top";

	// Initialize start values for X and Y translation
	let translateXStartValue = 0;
	let translateYStartValue = 0;

	// Determine the translation start values based on fromDirection
	switch (fromDirection) {
		case "left-top":
			translateXStartValue = -30;
			translateYStartValue = -30;
			break;
		case "right-top":
			translateXStartValue = 30;
			translateYStartValue = -30;
			break;
		case "bottom-top": // This direction seems a bit unclear, assuming it means from bottom to top
			translateYStartValue = 30;
			break;
		case "bottom-right":
			translateXStartValue = 30;
			translateYStartValue = 30;
			break;
		case "bottom-left":
			translateXStartValue = -30;
			translateYStartValue = 30;
			break;
		case "top":
			translateYStartValue = -10;
			break;
		case "bottom":
			translateYStartValue = 10;
			break;
		default:
			throw new Error("Invalid fromDirection value");
	}

	return {
		duration: options.duration,
		css: (t) => `
					opacity: ${t};
					transform: translate(${(1 - t) * translateXStartValue}px, ${(1 - t) * translateYStartValue}px) scale(${0.9 + 0.1 * t});
			`,
	};
}

export function handleInput(newValue, propertyPath) {
	user.update((currUser) => {
		// Create a new user object from current user data
		let newUser = { ...currUser };

		// Helper function to set a value at a path inside an object
		function setValue(obj, path, value) {
			let keys = path.split(".");
			let lastKey = keys.pop();
			let lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), obj);
			lastObj[lastKey] = value;
		}

		// Set the new value at the specified path
		setValue(newUser, propertyPath, newValue);

		return newUser;
	});
}
