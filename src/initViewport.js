SVG.extend(SVG.Doc, {
	initViewport: function(enablePanZoom, visibleBorderPxWhenAtMinimalZoom = 20) {
		// let X_AXIS = { trunk: this.rect(5, 1), tip: this.path('M5 0.5 L5 -2 L 8 0.5 L 5 3 Z'), caption: this.text('X').y(-20) },
			// Y_AXIS = { trunk: this.rect(1, 5), tip: this.path('M0.5 5 L-2 5 L 0.5 8 L 3 5 Z'), caption: this.text('Y').x(-12) };
			
		let initialViewbox = this.bbox();			
		initialViewbox.x -= visibleBorderPxWhenAtMinimalZoom;
		initialViewbox.x2 += visibleBorderPxWhenAtMinimalZoom;
		initialViewbox.width += 2 * visibleBorderPxWhenAtMinimalZoom;
		initialViewbox.y -= visibleBorderPxWhenAtMinimalZoom;
		initialViewbox.y2 += visibleBorderPxWhenAtMinimalZoom;
		initialViewbox.height += 2 * visibleBorderPxWhenAtMinimalZoom;
		
		let zoomMin = this.viewbox(initialViewbox).zoom(), // Also sets the initial Zoom in the process
		zoomMax = 10;

		if (enablePanZoom)
			this.panZoom({
				zoomMin: zoomMin,
				zoomMax: zoomMax,
				initialViewbox: initialViewbox
			});

		return this;
	}
});