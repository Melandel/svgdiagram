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
		return this.attr("X") || this.x();
	},
	X2: function() {
		return this.X() + this.width();
	},
	CX: function() {
		return this.X()  + 0.5 * this.width();
	},
	Y: function() {
		return this.attr("Y") || this.y();
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
		if (Math.abs(node1.cx() - node2.cx()) < 0.2) { return this.cx(node1.CX()); }
		else if (node1.cx() < node2.cx())            { return this.cx(Math.max(node1.X2() + 2, node1.X2() + (fraction || 0.5)*(node2.X()  - node1.X2()))); }
		else                                         { return this.cx(Math.min(node1.X()  - 2, node1.X()  + (fraction || 0.5)*(node2.X2() - node1.X() ))); }
	},
	_by: function(node1, node2, fraction) { 
		if (Math.abs(node1.cy() - node2.cy()) < 0.2) { return this.cy(node1.cy()); }
		else if (node1.cy() < node2.cy())            { return this.cy(Math.max(node1.Y2() + 2, node1.Y2() + (fraction || 0.5)*(node2.Y()  - node1.Y2()))); }
		else                                         { return this.cy(Math.min(node1.Y()  - 2, node1.Y()  + (fraction || 0.5)*(node2.Y2() - node1.Y() ))); }
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
			chainConfigOverride = isFirstArgANode ? {}
												  : args[0];
		let chainConfig = {};
		for (let prop in defaultChainConfig)
			chainConfig[prop] = defaultChainConfig[prop];
		for (let prop in chainConfigOverride)
			chainConfig[prop] = chainConfigOverride[prop];
		
		
		let i = isFirstArgANode ? 0 : 1,
			linkFrom,
			linkTo,
			doc = this.doc();
		switch (chainConfig.chain) {
			case "manyToOne":
				linkTo = this;
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
					
					let linkConfig = {};
					for (let prop in chainConfig)
						linkConfig[prop] = chainConfig[prop];
					for (let prop in linkConfigOverride)
						linkConfig[prop] = linkConfigOverride[prop];
					
					doc.arrow(linkFrom, linkTo, linkConfig);
					
					i += (isNextArgANode ? 1 : 2);
				}
				break;
				
			case "oneToMany":
			case "followThrough":
			default:
				linkFrom = this;
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
					
					let linkConfig = {};
					for (let prop in chainConfig)
						linkConfig[prop] = chainConfig[prop];
					for (let prop in linkConfigOverride)
						linkConfig[prop] = linkConfigOverride[prop];
					
					doc.arrow(linkFrom, linkTo, linkConfig);
					
					if (chainConfig.chain == "followThrough")
						linkFrom = linkTo;
					
					i += (isNextArgANode ? 1 : 2);
				}
				break;
		}
		
		return this;
	}
})