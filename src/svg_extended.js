let parseRelativePositionArgs = function(svgElement, node, distance) {
	let args = {
		node: node,
		distance: distance || 100
	};
	
	if(!node)
		args.node = svgElement.doc().lastShape();
	else if (typeof(node) == 'number' && !distance) {
		args.distance = node;
		args.node = svgElement.doc().lastShape();
	}

	return args;
}

SVG.extend(SVG.Text, SVG.Nested, {
	width: function () {
		return this.bbox().width;
	},
	height: function () {
		return this.bbox().height;
	}
})

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
	},
	_south: function(relativePositionArgs) { return this.cx(relativePositionArgs.node.cx()).y(relativePositionArgs.node.y2() + relativePositionArgs.distance); },
	_north: function(relativePositionArgs) { return this.cx(relativePositionArgs.node.cx()).y2(relativePositionArgs.node.y() - relativePositionArgs.distance); },
	_east: function(relativePositionArgs) { return this.x(relativePositionArgs.node.x2() + relativePositionArgs.distance).cy(relativePositionArgs.node.cy()); },
	_west: function(relativePositionArgs) { return this.x2(relativePositionArgs.node.x() - relativePositionArgs.distance).cy(relativePositionArgs.node.cy()); },
	
	south: function (node, distance) { return this._south(parseRelativePositionArgs(this, node, distance)); },	
	s:     function (node, distance) { return this._south(parseRelativePositionArgs(this, node, distance)); },	
	north: function (node, distance) { return this._north(parseRelativePositionArgs(this, node, distance)); },
	n:     function (node, distance) { return this._north(parseRelativePositionArgs(this, node, distance)); },
	east:  function (node, distance) { return this._east(parseRelativePositionArgs(this, node,  distance)); },
	e:     function (node, distance) { return this._east(parseRelativePositionArgs(this, node,  distance)); },
	west:  function (node, distance) { return this._west(parseRelativePositionArgs(this, node,  distance)); },
	w:     function (node, distance) { return this._west(parseRelativePositionArgs(this, node,  distance)); },

	_northEast: function(relativePositionArgs) { return this.x(relativePositionArgs.node.x2() + relativePositionArgs.distance).y2(relativePositionArgs.node.y() - relativePositionArgs.distance); },
	_northWest: function(relativePositionArgs) { return this.x2(relativePositionArgs.node.x() - relativePositionArgs.distance).y2(relativePositionArgs.node.y() - relativePositionArgs.distance); },
	_southEast: function(relativePositionArgs) { return this.x(relativePositionArgs.node.x2() + relativePositionArgs.distance).y(relativePositionArgs.node.y2() + relativePositionArgs.distance); },
	_southWest: function(relativePositionArgs) { return this.x2(relativePositionArgs.node.x() - relativePositionArgs.distance).y(relativePositionArgs.node.y2() + relativePositionArgs.distance); },
	
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
		return this.cx(relativePositionPolarArgs.node.cx() + relativePositionPolarArgs.distance * Math.cos(angleInRadians))
				   .cy(relativePositionPolarArgs.node.cy() + relativePositionPolarArgs.distance * Math.sin(angleInRadians));
	},
	polar: function(node, angleInDegrees, distance) { return this._polar(angleInDegrees, parseRelativePositionArgs(this, node, distance)); },
	p:     function(node, angleInDegrees, distance) { return this._polar(angleInDegrees, parseRelativePositionArgs(this, node, distance)); },
	
	_bx: function(node1, node2, fraction) { 
		if (Math.abs(node1.cx() - node2.cx()) < 0.2) { return this.cx(node1.cx()); }
		else if (node1.cx() < node2.cx())            { return this.cx(Math.max(node1.x2() + 2, node1.x2() + (fraction || 0.5)*(node2.x() - node1.x2()))); }
		else                                         { return this.cx(Math.min(node1.x() - 2, node1.x()  + (fraction || 0.5)*(node2.x2() - node1.x()))); }
	},
	_by: function(node1, node2, fraction) { 
		if (Math.abs(node1.cy() - node2.cy()) < 0.2) { return this.cy(node1.cy()); }
		else if (node1.cy() < node2.cy())            { return this.cy(Math.max(node1.y2() + 2, node1.y2() + (fraction || 0.5)*(node2.y() - node1.y2()))); }
		else                                         { return this.cy(Math.min(node1.y() - 2, node1.y()  + (fraction || 0.5)*(node2.y2() - node1.y()))); }
	},
	between: function(node1, node2, fraction) { return this._bx(node1, node2, fraction)._by(node1, node2, fraction); },
	b:       function(node1, node2, fraction) { return this._bx(node1, node2, fraction)._by(node1, node2, fraction); },
	bx:      function(node1, node2, fraction) { return this._bx(node1, node2, fraction).cy(node1.cy()); },
	by:      function(node1, node2, fraction) { return this.cx(node1.cx())._by(node1, node2, fraction); }
});