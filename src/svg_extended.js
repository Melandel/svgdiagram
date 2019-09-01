let parseRelativePositionArgs = function(svgElement, node, distance) {
	let defaultDistance = 100;
	
	let args = {
			node: node,
			distance: distance || defaultDistance
		};
	
	if(!node)
		args.node = svgElement.doc().lastShape();
	else if (typeof(node) == 'number' && !distance) {
		args.distance = node;
		args.node = svgElement.doc().lastShape();
	}

	if (args.distance <= 1)
		args.distance = args.distance * defaultDistance;
	
	return args;
}

SVG.extend(SVG.Doc, {
	lastShape: function(shape){
		if (!this._lastShapes)
			this._lastShapes = {
				penultimateDomID: null,
				lastDomID: null
			};
		
		if (shape) {
			this._lastShapes.penultimateDomID = this._lastShapes.lastDomID;
			this._lastShapes.lastDomID = shape.id();
		}
		
		return SVG.get(this._lastShapes.penultimateDomID);
	}
});

SVG.extend(SVG.Element, {
	x2: function (x2) {
		if (x2 == null)
			return this.x() + this.width();
		else if (!isNaN(x2))
			return this.x(x2 - this.width());
	},
	y2: function (y2) {
		if (y2 == null)
			return this.y() + this.height();
		else if (!isNaN(y2))
			return this.y(y2 - this.height());
	}
});

SVG.extend(SVG.Nested, {
	width: function () {
		return this.bbox().width;
	},
	height: function () {
		return this.bbox().height;
	}
});

SVG.extend(SVG.Element, SVG.Nested, {
	X: function() {
		let attrX = this.attr("X");
		if (attrX == null)
			return this.x();
		else
			return attrX;
	},
	X2: function() {
		return this.X() + this.width();
	},
	CX: function() {
		return this.X()  + 0.5 * this.width();
	},
	Y: function() {
		let attrY = this.attr("Y");
		if (attrY == null)
			return this.y();
		else
			return attrY;
	},
	Y2: function() {
		return this.Y() + this.height();
	},
	CY: function() {
		return this.Y()  + 0.5 * this.height();
	}
});

SVG.extend(SVG.Text, {
	width: function () {
		return this.bbox().width;
	},
	height: function () {
		return this.bbox().height;
	},
	setFontSize: function(n) {
		if (!window.refFontSize)
			window.refFontSize = parseInt(window.getComputedStyle(document.body).fontSize);
		
		return this.font('size', (n <= 1) ? (n * window.refFontSize) : n)
			.move(0,0); // https://github.com/svgdotjs/svg.js/issues/691#issuecomment-308067928
	},
	underline: function () {
		let parent = this.parent(),
			underline = parent.rect(this.width(), 1).move(this.x(), this.y2() + 2).fill(this.attr('fill')).transform(this.transform()),
			group = parent.group();

		group.add(this);
		group.add(underline);

		return this;
	}
});

SVG.extend(SVG.Element, {
	_south: function(relativePositionArgs) { return this.cx(relativePositionArgs.node.CX()).y(relativePositionArgs.node.Y2() + relativePositionArgs.distance); },
	_north: function(relativePositionArgs) { return this.cx(relativePositionArgs.node.CX()).y2(relativePositionArgs.node.Y() - relativePositionArgs.distance); },
	_east: function(relativePositionArgs) { return this.x(relativePositionArgs.node.X2() + relativePositionArgs.distance).cy(relativePositionArgs.node.CY()); },
	_west: function(relativePositionArgs) { return this.x2(relativePositionArgs.node.X() - relativePositionArgs.distance).cy(relativePositionArgs.node.CY()); },
	
	south: function (node, distance) { return this._south(parseRelativePositionArgs(this, node, distance)); },	
	s:     function (node, distance) { return this._south(parseRelativePositionArgs(this, node, distance)); },	
	north: function (node, distance) { return this._north(parseRelativePositionArgs(this, node, distance)); },
	n:     function (node, distance) { return this._north(parseRelativePositionArgs(this, node, distance)); },
	east:  function (node, distance) { return this._east(parseRelativePositionArgs(this, node,  distance)); },
	e:     function (node, distance) { return this._east(parseRelativePositionArgs(this, node,  distance)); },
	west:  function (node, distance) { return this._west(parseRelativePositionArgs(this, node,  distance)); },
	w:     function (node, distance) { return this._west(parseRelativePositionArgs(this, node,  distance)); },
	
	_alignedOnX: function (node) {return this.x(node.X())},
	_alignedOnX2: function (node) {return this.x2(node.X2())},
	_alignedOnCx: function (node) {return this.cx(node.CX())},
	_alignedOnY: function (node) {return this.y(node.Y())},
	_alignedOnY2: function (node) {return this.y2(node.Y2())},
	_alignedOnCy: function (node) {return this.cy(node.CY())},
	
	alignedOnX:  function (node) {return this._alignedOnX(node)},
	alignedOnX2: function (node) {return this._alignedOnX2(node)},
	alignedOnCx: function (node) {return this._alignedOnCx(node)},
	ax:  function (node) {return this._alignedOnX(node)},
	ax2: function (node) {return this._alignedOnX2(node)},
	acx: function (node) {return this._alignedOnCx(node)},
	alignedOnY:  function (node) {return this._alignedOnY(node)},
	alignedOnY2: function (node) {return this._alignedOnY2(node)},
	alignedOnCy: function (node) {return this._alignedOnCy(node)},
	ay:  function (node) {return  this._alignedOnY(node)},
	ay2: function (node) {return this._alignedOnY2(node)},
	acy: function (node) {return this._alignedOnCy(node)},
	
	_southAlignedOnX:  function(relativePositionArgs) { return this.x(relativePositionArgs.node.X())  .y(relativePositionArgs.node.Y2() + relativePositionArgs.distance); },
	_southAlignedOnX2: function(relativePositionArgs) { return this.x2(relativePositionArgs.node.X2()).y(relativePositionArgs.node.Y2() + relativePositionArgs.distance); },
	_northAlignedOnX:  function(relativePositionArgs) { return this.x(relativePositionArgs.node.X())  .y2(relativePositionArgs.node.Y() - relativePositionArgs.distance); },
	_northAlignedOnX2: function(relativePositionArgs) { return this.x2(relativePositionArgs.node.X2()).y2(relativePositionArgs.node.Y() - relativePositionArgs.distance); },
	_eastAlignedOnY:   function(relativePositionArgs) { return this.x(relativePositionArgs.node.X2() + relativePositionArgs.distance).y(relativePositionArgs.node.Y()); },
	_eastAlignedOnY2:  function(relativePositionArgs) { return this.x(relativePositionArgs.node.X2() + relativePositionArgs.distance).y2(relativePositionArgs.node.Y2()); },
	_westAlignedOnY:   function(relativePositionArgs) { return this.x2(relativePositionArgs.node.X() - relativePositionArgs.distance).y(relativePositionArgs.node.Y()); },
	_westAlignedOnY2:  function(relativePositionArgs) { return this.x2(relativePositionArgs.node.X() - relativePositionArgs.distance).y2(relativePositionArgs.node.Y2()); },
	
	southAlignedOnX: function (node, distance) { return this._southAlignedOnX(parseRelativePositionArgs(this, node, distance)); },
	southAlignedOnX2: function (node, distance) { return this._southAlignedOnX2(parseRelativePositionArgs(this, node, distance)); },
	sax: function (node, distance) { return this._southAlignedOnX(parseRelativePositionArgs(this, node, distance)); },
	sax2: function (node, distance) { return this._southAlignedOnX2(parseRelativePositionArgs(this, node, distance)); },
	
	northAlignedOnX: function (node, distance) { return this._northAlignedOnX(parseRelativePositionArgs(this, node, distance)); },
	northAlignedOnX2: function (node, distance) { return this._northAlignedOnX2(parseRelativePositionArgs(this, node, distance)); },
	nax: function (node, distance) { return this._northAlignedOnX(parseRelativePositionArgs(this, node, distance)); },
	nax2: function (node, distance) { return this._northAlignedOnX2(parseRelativePositionArgs(this, node, distance)); },
	
	eastAlignedOnY:  function (node, distance) { return this._eastAlignedOnY(parseRelativePositionArgs(this, node,  distance)); },
	eastAlignedOnY2:  function (node, distance) { return this._eastAlignedOnY2(parseRelativePositionArgs(this, node,  distance)); },
	eay:  function (node, distance) { return this._eastAlignedOnY(parseRelativePositionArgs(this, node,  distance)); },
	eay2:  function (node, distance) { return this._eastAlignedOnY2(parseRelativePositionArgs(this, node,  distance)); },
	
	westAlignedOnY:  function (node, distance) { return this._westAlignedOnY(parseRelativePositionArgs(this, node,  distance)); },
	westAlignedOnY2:  function (node, distance) { return this._westAlignedOnY2(parseRelativePositionArgs(this, node,  distance)); },
	way:  function (node, distance) { return this._westAlignedOnY(parseRelativePositionArgs(this, node,  distance)); },
	way2:  function (node, distance) { return this._westAlignedOnY2(parseRelativePositionArgs(this, node,  distance)); },

	_northEast: function(relativePositionArgs) { return this.x(relativePositionArgs.node.X2() + relativePositionArgs.distance).y2(relativePositionArgs.node.Y() - relativePositionArgs.distance); },
	_northWest: function(relativePositionArgs) { return this.x2(relativePositionArgs.node.X() - relativePositionArgs.distance).y2(relativePositionArgs.node.Y() - relativePositionArgs.distance); },
	_southEast: function(relativePositionArgs) { return this.x(relativePositionArgs.node.X2() + relativePositionArgs.distance).y(relativePositionArgs.node.Y2() + relativePositionArgs.distance); },
	_southWest: function(relativePositionArgs) { return this.x2(relativePositionArgs.node.X() - relativePositionArgs.distance).y(relativePositionArgs.node.Y2() + relativePositionArgs.distance); },
	
	northEast: function (node, distance) { return this._northEast(parseRelativePositionArgs(this, node, distance)); },
	ne:        function (node, distance) { return this._northEast(parseRelativePositionArgs(this, node, distance)); },	
	northWest: function (node, distance) { return this._northWest(parseRelativePositionArgs(this, node, distance)); },
	nw:        function (node, distance) { return this._northWest(parseRelativePositionArgs(this, node, distance)); },
	southEast: function (node, distance) { return this._southEast(parseRelativePositionArgs(this, node, distance)); },
	se:        function (node, distance) { return this._southEast(parseRelativePositionArgs(this, node, distance)); },
	southWest: function (node, distance) { return this._southWest(parseRelativePositionArgs(this, node, distance)); },
	sw:        function (node, distance) { return this._southWest(parseRelativePositionArgs(this, node, distance)); },
	
	_polar: function(angleInDegrees, relativePositionPolarArgs) {
		let angleInRadians = angleInDegrees * (Math.PI / 180);
		return this.cx(relativePositionPolarArgs.node.CX() + relativePositionPolarArgs.distance * Math.cos(angleInRadians))
				   .cy(relativePositionPolarArgs.node.CY() + relativePositionPolarArgs.distance * Math.sin(angleInRadians));
	},
	polar: function(node, angleInDegrees, distance) { return this._polar(angleInDegrees, parseRelativePositionArgs(this, node, distance)); },
	p:     function(node, angleInDegrees, distance) { return this._polar(angleInDegrees, parseRelativePositionArgs(this, node, distance)); },
	
	_bx: function(node1, node2, fraction) { 
		if (Math.abs(node1.CX() - node2.CX()) < 0.2) { return this.cx(node1.CX()); }
		else if (node1.CX() < node2.CX())            { return this.cx(node1.X2() + (fraction || 0.5)*(node2.X()  - node1.X2())); }
		else                                         { return this.cx(node1.X()  + (fraction || 0.5)*(node2.X2() - node1.X() )); }
	},
	_by: function(node1, node2, fraction) { 
		if (Math.abs(node1.CY() - node2.CY()) < 0.2) { return this.cy(node1.CY()); }
		else if (node1.CY() < node2.CY())            { return this.cy(node1.Y2() + (fraction || 0.5)*(node2.Y()  - node1.Y2())); }
		else                                         { return this.cy(node1.Y()  + (fraction || 0.5)*(node2.Y2() - node1.Y() )); }
	},
	between: function(node1, node2, fraction) { return this._bx(node1, node2, fraction)._by(node1, node2, fraction); },
	b:       function(node1, node2, fraction) { return this._bx(node1, node2, fraction)._by(node1, node2, fraction); },
	bx:      function(node1, node2, fraction) { return this._bx(node1, node2, fraction).cy(node1.CY()); },
	by:      function(node1, node2, fraction) { return this.cx(node1.CX())._by(node1, node2, fraction); }
});

SVG.extend(SVG.Nested, {
	chain: function (...args) {
		let defaultChainConfig = {
				chain: "followThrough"
			},
			isFirstArgANode = (args[0] instanceof SVG.Nested),
			chainConfig = isFirstArgANode ? {} : args[0];		
		
		let i = isFirstArgANode ? 0 : 1,
			linkFrom = this,
			linkTo,
			doc = this.doc();
		while (i < args.length) {
			linkTo = args[i];
			let nextArg = args[i+1],
				isNextArgANode = (nextArg instanceof SVG.Nested),
				linkConfigOverride;
			
			if (!nextArg || isNextArgANode)
				linkConfigOverride = {};
			else if (typeof nextArg == "string")
				linkConfigOverride = { caption: nextArg };
			else
				linkConfigOverride = nextArg;
			
			let linkConfig = override(chainConfig, linkConfigOverride);
			
			doc.arrow(linkFrom, linkTo, linkConfig);
			
			linkFrom = linkTo;
			
			i += (isNextArgANode ? 1 : 2);
		}
		
		return this;
	},
	oneToMany: function (...args) {
		let defaultChainConfig = {
				chain: "followThrough"
			},
			isFirstArgANode = (args[0] instanceof SVG.Nested),
			chainConfig = isFirstArgANode ? {} : args[0];		
		
		let i = isFirstArgANode ? 0 : 1,
			linkFrom = this,
			linkTo,
			doc = this.doc();
		while (i < args.length) {
			linkTo = args[i];
			let nextArg = args[i+1],
				isNextArgANode = (nextArg instanceof SVG.Nested),
				linkConfigOverride;
			
			if (!nextArg || isNextArgANode)
				linkConfigOverride = {};
			else if (typeof nextArg == "string")
				linkConfigOverride = { caption: nextArg };
			else
				linkConfigOverride = nextArg;
			
			let linkConfig = override(chainConfig, linkConfigOverride);
			
			doc.arrow(linkFrom, linkTo, linkConfig);
			
			i += (isNextArgANode ? 1 : 2);
		}
		return this;
	},
	manyToOne: function (...args) {
		let defaultChainConfig = {
				chain: "followThrough"
			},
			isFirstArgANode = (args[0] instanceof SVG.Nested),
			chainConfig = isFirstArgANode ? {} : args[0];		
		
		let i = isFirstArgANode ? 0 : 1,
			linkFrom,
			linkTo = this,
			doc = this.doc();
		while (i < args.length) {
			linkFrom = args[i];
			let nextArg = args[i+1],
				isNextArgANode = (nextArg instanceof SVG.Nested),
				linkConfigOverride;
			
			if (!nextArg || isNextArgANode)
				linkConfigOverride = {};
			else if (typeof nextArg == "string")
				linkConfigOverride = { caption: nextArg };
			else
				linkConfigOverride = nextArg;
			
			let linkConfig = override(chainConfig, linkConfigOverride);
			
			doc.arrow(linkFrom, linkTo, linkConfig);
			
			i += (isNextArgANode ? 1 : 2);
		}
		return this;
	}
})