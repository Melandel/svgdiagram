let drawDiagram = function drawDiagram (domContainerID, title, drawContent) {
	let svg = null;
	if (typeof domContainerID === "string")
		svg = SVG(domContainerID);
	else {
		domContainerID.id = domContainerID.id || ("svgContainer" + Math.floor(Math.random() * 1001));
		svg = SVG(domContainerID.id);
	}
	svg.node.addEventListener("mousedown", function (ev) { if (ev.button === 2) { this.style.cursor = "move";    } });
	svg.node.addEventListener("mouseup",   function (ev) { if (ev.button === 2) { this.style.cursor = "default"; } });

	window.svg = svg;
	window.isFirstNode = true;
	
	let drawingTool = function(...args) {
		let drawn;
		if(args.some(x => x instanceof SVG.Frame || x instanceof SVG.RNode))
			drawn = svg.frame(...args);
		else {
			drawn =  svg.rnode(...args);
		
			if (window.isFirstNode) {
				drawn.fill("#ffbe0b");
				window.isFirstNode = false;
			}
		}
		
		return drawn;
	};
	
	let options = {
		shouldMatchParentSize: false,
		enablePanZoom: true
	};
	drawContent(drawingTool, options);
	svg.background(capitalizeFirstLetter(title), ...svg.children().filter(x => x.type !== "defs"));
	svg.initViewport(options.enablePanZoom);
	
	if(!options.shouldMatchParentSize) {
		let bbox = svg.bbox();
		
		svg.size(bbox.width, bbox.height);
	}
	// By default, SVG has width="100%" and height="100%"
	
	return svg;
}