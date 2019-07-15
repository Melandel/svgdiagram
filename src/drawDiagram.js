let drawDiagram = function drawDiagram (domContainerID, title, drawContent) {
	let svg = SVG(domContainerID);
	window.svg = svg;
	window.isFirstNode = true;
	window.refFontSize = window.getComputedStyle(document.body).fontSize;
	
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
		let drawn =  svg.rnode(...args);
		
		if (window.isFirstNode) {
			drawn.fill("orange");
			window.isFirstNode = false;
		}
		
		return drawn;
	};
	
	drawContent(drawingTool);
	// svg.drawTitle(title);
	return svg;
}