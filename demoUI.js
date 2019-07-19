var addCase = function(title, drawFunction) {
	let isFirstTime = !document.getElementById("toc");
	if(isFirstTime) {
		document.body = document.createElement("body");
		document.body.style.overflow = "hidden";
		
		let toc = document.createElement("div");
			toc.id = "toc";
			toc.style.float = "left";
			toc.style.background = "LightSlateGray ";
			toc.style.height = "100%";
			toc.style.width = "19%";
			toc.style.textAlign = "start";
			toc.style.textIndent = "5px";
			toc.style.fontFamily = "Impact";
			toc.style.overflowY = "auto";
		document.body.appendChild(toc);
		window.toc = toc;
		
		let tocItemPattern = document.createElement("p");
			tocItemPattern.style.cursor = "pointer";
		window.tocItemPattern = tocItemPattern;
		
		
		let content = document.createElement("div");
			content.id = "content";
			content.style.float = "right";
			content.style.height = "100%";
			content.style.width = "80%";
		document.body.appendChild(content);
		window.content = content;
		
		var demoCasePattern = document.createElement("div");
			demoCasePattern.style.height = "100%";
			demoCasePattern.style.overflow = "auto";
		let statusBar = document.createElement("div");
			statusBar.style.background = "coral";
			statusBar.style.fontFamily = "Verdana, Geneva, sans-serif";
			statusBar.style.textAlign = "center";
			statusBar.style.marginBottom = "5px";
		let svgContainer = document.createElement("div");
			svgContainer.style.border = "1px black solid";
		let codeContainer = document.createElement("div");
			codeContainer.style.background = "lightgrey";
			codeContainer.style.fontFamily = '"Courier New", Courier, monospace';
		demoCasePattern.appendChild(statusBar);
		demoCasePattern.appendChild(svgContainer);
		demoCasePattern.appendChild(codeContainer);
		
		window.demoCasePattern = demoCasePattern;
	}

	
	let tocItem = window.tocItemPattern.cloneNode();
	window.toc.appendChild(tocItem);
	tocItem.id = '#' + title;
	tocItem.textContent = title;
	
	let displayDemoCase = function() {
		tocItem.style.background = "yellow";
		window.lastTocItemDisplayed = tocItem;
		
		let demoCase = window.demoCasePattern.cloneNode(true);
		window.content.appendChild(demoCase);
		let statusBar = demoCase.firstChild,
			svgContainer = demoCase.childNodes[1],
			codeContainer = demoCase.lastChild;
		
		demoCase.id = title;
		svgContainer.id = title + "_svg";
		codeContainer.id = title + "_code";
		
		let svgGenerationStart = Date.now(),
			svgDiagram = drawDiagram(svgContainer.id, title, drawFunction),
			generationDuration = Date.now() - svgGenerationStart,
			drawFunctionIndentation = "\t\t",
			functionIndentationDefaultLevel = drawFunctionIndentation.length,
			drawFunctionBody = drawFunction.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1].split('\n').map(function(str) { return str.substring(functionIndentationDefaultLevel); }).join('\n').replace(/\t/g, '    '),
			nbElements = 0;
			
		svgDiagram.each(function(i, children) { nbElements++; }, true);
		window.svg = svgDiagram;
		statusBar.textContent = `svg (${nbElements} elements) generated in ${generationDuration}ms.`
		codeContainer.insertAdjacentHTML("beforeend", "<pre>" + drawFunctionBody + "</pre>");
	}
	
	if (isFirstTime)
		displayDemoCase();
	
	tocItem.addEventListener("click", function() {
		window.lastTocItemDisplayed.style.background = null;

		window.content.removeChild(window.content.firstChild);
		displayDemoCase();
	});	
}