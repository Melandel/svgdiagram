let drawDiagram = function drawDiagram (domContainerID, title, drawContent) {
	let svg = SVG(domContainerID);
	svg.node.addEventListener("mousedown", function (ev) { if (ev.button === 2) { this.style.cursor = "move";    } });
	svg.node.addEventListener("mouseup",   function (ev) { if (ev.button === 2) { this.style.cursor = "default"; } });

	window.svg = svg;
	window.isFirstNode = true;
	
	let drawingTool = function(...args) {
		/* NODES // depth:4
			drawingTool("title")
			drawingTool("title", "content")
			drawingTool("title", ["cell1", "cell2"])
			drawingTool("title", ["cellA1", "cellA2"], ["cellB1", "cellB2"])
		   FRAMES // depth:3
			drawingTool("title", node)
			drawingTool("title", node1, node2)
			drawingTool("title", node1, node2, text)
			drawingTool("title", node1, node2, text1, text2)
		   SETS // depth:2
			drawingTool("title", frame)
			drawingTool("title", frame1, frame2)
			drawingTool("title", frame1, frame2, node1, node2, text1, text2)
		   BIGSETS // depth:1
			drawingTool("title", set)
			drawingTool("title", set1, set2)
			drawingTool("title", set1, set2, frame1, frame2, node1, node2, text1, text2)
		   BACKGROUND // depth:0
		*/
		
		// Dummy implementation
		let drawn;
		if(args.some(x => x instanceof SVG.Frame || x instanceof SVG.RNode))
			drawn = svg.frame(...args);
		else {
			drawn =  svg.rnode(...args);
		
			if (window.isFirstNode) {
				drawn.fill("#ef3e36");
				window.isFirstNode = false;
			}
		}
		
		return drawn;
	};
	
	drawContent(drawingTool);
	svg.background(capitalizeFirstLetter(title), ...svg.children().filter(x => x.type !== "defs"));
	svg.initViewport();
	
	return svg;
}