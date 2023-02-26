function Dimension(elm) {
	var elmHeight, elmMargin;
	if (document.all) {
		// IE
		elmHeight = elm.currentStyle.height;
		elmMargin =
			parseInt(elm.currentStyle.marginTop, 10) +
			parseInt(elm.currentStyle.marginBottom, 10) +
			"px";
	} else {
		// Mozilla
		elmHeight = document.defaultView
			.getComputedStyle(elm, "")
			.getPropertyValue("height");
		elmMargin =
			parseInt(
				document.defaultView
					.getComputedStyle(elm, "")
					.getPropertyValue("margin-top")
			) +
			parseInt(
				document.defaultView
					.getComputedStyle(elm, "")
					.getPropertyValue("margin-bottom")
			);
	}
	return elmHeight;
	// return elmHeight + elmMargin;
}

export function accordion(node, isOpen) {
	let initialHeight = Dimension(node);
	node.style.height = isOpen ? "auto" : 0;
	return {
		update(isOpen) {
			let animation = node.animate(
				[
					{
						height: initialHeight,
					},
					{
						height: 0,
					},
				],
				{ duration: 150, fill: "both", easing: "linear" }
			);
			animation.pause();
			if (!isOpen) {
				animation.play();
				console.log(isOpen);
			} else {
				animation.reverse();
				console.log(isOpen);
			}
		},
	};
}
