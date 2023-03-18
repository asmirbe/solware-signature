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
	let initialHeight = node.scrollHeight;
	node.style.height = isOpen ? initialHeight + 'px' : 0;
	node.style.display = isOpen ? 'flex' : '';
	node.style.flexDirection = isOpen ? 'column' : '';
	node.style.marginBottom = isOpen ? '20px' : '';
	node.style.zIndex = isOpen ? '2' : '';
	return {
		update(isOpen) {
			initialHeight = Dimension(node);
			let targetHeight = isOpen ? initialHeight : 0;
			if(!isOpen) {
				node.classList.add('hidden');
				node.style.zIndex = '0';
			};
			let animation = node.animate(
				[
					{
						height: isOpen ? 0 : initialHeight + 'px',
					},
					{
						height: isOpen ? initialHeight + 'px' : 0,
					}
				],
				{ duration: 200, fill: 'both' }
			);

			animation.finished.then(() => {
				node.style.height = isOpen ? 'auto' : 0;
				node.style.display = isOpen ? 'flex' : '';
				node.style.flexDirection = isOpen ? 'column' : '';
				node.style.marginBottom = isOpen ? '20px' : '';
				node.style.zIndex = isOpen ? '2' : '';
				isOpen && node.classList.remove('hidden');
			});
		}
	};
}


// export function accordion(node, isOpen) {
// 	let initialHeight = Dimension(node);
// 	node.style.height = `${isOpen ? initialHeight : 0}px`;
// 	return {
// 		update(isOpen) {
// 			let targetHeight = isOpen ? Dimension(node) : 0;
// 			node.style.height = `${targetHeight}px`;
// 			node.style.display = `${isOpen ? 'flex' : ''}`;
// 			node.style.flexDirection = `${isOpen ? 'column' : ''}`;
// 			node.style.marginBottom = `${isOpen ? '20px' : ''}`;
// 			node.style.zIndex = `${isOpen ? '2' : ''}`;
// 		},
// 	};
// }
