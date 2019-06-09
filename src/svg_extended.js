SVG.extend(SVG.Text, {
	width: function () {
		return this.bbox().width;
	},
	height: function () {
		return this.bbox().height;
	}
})