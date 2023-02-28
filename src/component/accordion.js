function Dimension(elm) {
	// Add-up all the height and margin top/bottom of each children and return the total value
	let totalHeight = 0;
	for (let i = 0; i < elm.children.length; i++) {
		let child = elm.children[i];
		totalHeight += child.offsetHeight + parseInt(getComputedStyle(child).marginTop) + parseInt(getComputedStyle(child).marginBottom);
	}
	return totalHeight;
}

export function accordion(node, isOpen) {
	let initialHeight = Dimension(node);
	node.style.height = `${isOpen ? initialHeight : 0}px`;
	return {
		update(isOpen) {
			let targetHeight = isOpen ? Dimension(node) : 0;
			node.style.height = `${targetHeight}px`;
		},
	};
}
