	SVG.Arrow = SVG.invent({
		create: function (config) {
			SVG.Nested.call(this);
			
			this.move(config.xfrom, config.yfrom);
			
			switch (config.type) {
				case "simple":
				default:
					this.path(`
						M ${0} ${0 - 1}
						L ${0 + config.length - 5} ${0 - 1}
						L ${0 + config.length - 10} ${0 - 1 -7}
						L ${0 + config.length} ${0}
						L ${0 + config.length - 10} ${0 + 1 +7}
						L ${0 + config.length - 5} ${0 + 1}
						L ${0} ${0 + 1}
						Z
					`).rotate(config.angle_degrees, 0, 0)
					  .fill(config.color ||'SlateBlue');
					
					if (config.caption) {
						this.text(config.caption)
							.setFontSize(0.8)
							.cx(0.5 * (config.xto - config.xfrom)  + 12 * Math.cos(config.angle_radians - 0.5 * Math.PI))
							.cy(0.5 * (config.yto - config.yfrom)  + 12 * Math.sin(config.angle_radians - 0.5 * Math.PI))
							.fill('SlateBlue');
					}
				break;
			}
		},
		inherit: SVG.Nested,
		construct: {
			arrow: function (fromNode, toNode, options) {
				return svg.put(new SVG.Arrow(parseArrowArgs(fromNode, toNode, options)));
			}
		}
	});

let parseArrowArgs = function(fromNode, toNode, options) {
	options = options || {}
	
	let args = {};
	
	if(typeof options === 'string') {
		args.type = "simple";
		args.caption = options;
	}
	else {
		options.type = options.type || "simple";
		for (let prop in options)
			args[prop] = options[prop];
		
		let isFromCenter = false;
		switch (options.from) {
			case "e":
				args.xfrom = fromNode.x2();
				args.yfrom = fromNode.cy();
				break;
			case "s":
				args.xfrom = fromNode.cx();
				args.yfrom = fromNode.y2();
				break;
			case "w":
				args.xfrom = fromNode.x();
				args.yfrom = fromNode.cy();
				break;
			case "n":
				args.xfrom = fromNode.cx();
				args.yfrom = fromNode.y();
				break;
			case "ne":
				args.xfrom = fromNode.x2();
				args.yfrom = fromNode.y();
				break;
			case "nw":
				args.xfrom = fromNode.x();
				args.yfrom = fromNode.y();
				break;
			case "se":
				args.xfrom = fromNode.x2();
				args.yfrom = fromNode.y2();
				break;
			case "sw":
				args.xfrom = fromNode.x();
				args.yfrom = fromNode.y2();
				break;
			case "ese":
				args.xfrom = fromNode.x2();
				args.yfrom = fromNode.y() + 0.75 * (fromNode.y2() - fromNode.y());
				break;
			case "sse":
				args.xfrom = fromNode.x() + 0.75 * (fromNode.x2() - fromNode.x());
				args.yfrom = fromNode.y2();
				break;
			case "ssw":
				args.xfrom = fromNode.x() + 0.25 * (fromNode.x2() - fromNode.x());
				args.yfrom = fromNode.y2();
				break;
			case "wsw":
				args.xfrom = fromNode.x();
				args.yfrom = fromNode.y() + 0.75 * (fromNode.y2() - fromNode.y());
				break;
			case "wnw":
				args.xfrom = fromNode.x();
				args.yfrom = fromNode.y() + 0.25 * (fromNode.y2() - fromNode.y());
				break;
			case "nnw":
				args.xfrom = fromNode.x() + 0.25 * (fromNode.x2() - fromNode.x());
				args.yfrom = fromNode.y();
				break;
			case "nne":
				args.xfrom = fromNode.x() + 0.75 * (fromNode.x2() - fromNode.x());
				args.yfrom = fromNode.y();
				break;
			case "ene":
				args.xfrom = fromNode.x2();
				args.yfrom = fromNode.y() + 0.25 * (fromNode.y2() - fromNode.y());
				break;
			default:
				isFromCenter = true;
				break;
		}
		
		let isToCenter = false;
		switch (options.to) {
			case "e":
				args.xto = toNode.x2();
				args.yto = toNode.cy();
				break;
			case "s":
				args.xto = toNode.cx();
				args.yto = toNode.y2();
				break;
			case "w":
				args.xto = toNode.x();
				args.yto = toNode.cy();
				break;
			case "n":
				args.xto = toNode.cx();
				args.yto = toNode.y();
				break;
			case "ne":
				args.xto = toNode.x2();
				args.yto = toNode.y();
				break;
			case "nw":
				args.xto = toNode.x();
				args.yto = toNode.y();
				break;
			case "se":
				args.xto = toNode.x2();
				args.yto = toNode.y2();
				break;
			case "sw":
				args.xto = toNode.x();
				args.yto = toNode.y2();
				break;
			case "ese":
				args.xto = toNode.x2();
				args.yto = toNode.y() + 0.75 * (toNode.y2() - toNode.y());
				break;
			case "sse":
				args.xto = toNode.x() + 0.75 * (toNode.x2() - toNode.x());
				args.yto = toNode.y2();
				break;
			case "ssw":
				args.xto = toNode.x() + 0.25 * (toNode.x2() - toNode.x());
				args.yto = toNode.y2();
				break;
			case "wsw":
				args.xto = toNode.x();
				args.yto = toNode.y() + 0.75 * (toNode.y2() - toNode.y());
				break;
			case "wnw":
				args.xto = toNode.x();
				args.yto = toNode.y() + 0.25 * (toNode.y2() - toNode.y());
				break;
			case "nnw":
				args.xto = toNode.x() + 0.25 * (toNode.x2() - toNode.x());
				args.yto = toNode.y();
				break;
			case "nne":
				args.xto = toNode.x() + 0.75 * (toNode.x2() - toNode.x());
				args.yto = toNode.y();
				break;
			case "ene":
				args.xto = toNode.x2();
				args.yto = toNode.y() + 0.25 * (toNode.y2() - toNode.y());
				break;
			default:
				isToCenter = true;
				break;
		}
		
		if (isFromCenter || isToCenter) {
			let x1, y1, x2, y2;
			if (isFromCenter && isToCenter) {             x1 = fromNode.cx(); y1 = fromNode.cy(); x2 = toNode.cx(); y2 =toNode.cy(); }
			else if (isFromCenter && !isToCenter) {       x1 = fromNode.cx(); y1 = fromNode.cy(); x2 = args.xto;    y2 = args.yto;   }
			else { /* if (!isFromCenter && isToCenter) */ x1 = args.xfrom;    y1 = args.yfrom;    x2 = toNode.cx(); y2 =toNode.cy(); }
			
			let coeff = (y2 - y1) / (x2-x1),
				toTheRight = (x2 > x1),
				yFromX = function (x) { return y1 + coeff * (x - x1); },
				xFromY = function (y) { return x1 + (y - y1) / coeff; };
			
			args.yFromX = yFromX;
			args.xFromY = xFromY;
	
			if (isFromCenter) {
				let xfromCandidate = (x2 > x1) ? fromNode.x2() : fromNode.x(),
					yfromCandidate = (y2 > y1) ? fromNode.y2() : fromNode.y(),
					yMatchingToXCandidate = yFromX(xfromCandidate);
					
				if (yMatchingToXCandidate >= fromNode.y() && yMatchingToXCandidate <= fromNode.y2()) {
					args.xfrom = xfromCandidate;
					args.yfrom = yMatchingToXCandidate;
				}
				else {
					let xMatchingToYCandidate = xFromY(yfromCandidate);
					args.xfrom = xMatchingToYCandidate;
					args.yfrom = yfromCandidate;
				}
			}

			if (isToCenter) {
				let xtoCandidate = (x2 > x1) ? toNode.x() : toNode.x2(),
					ytoCandidate = (y2 > y1) ? toNode.y() : toNode.y2(),
					yMatchingToXCandidate = yFromX(xtoCandidate);
					
				if (yMatchingToXCandidate >= toNode.y() && yMatchingToXCandidate <= toNode.y2()) {
					args.xto = xtoCandidate;
					args.yto = yMatchingToXCandidate;
				}
				else {
					let xMatchingToYCandidate = xFromY(ytoCandidate);
					args.xto = xMatchingToYCandidate;
					args.yto = ytoCandidate;
				}
			}
		}
		else {
			let coeff = (args.yto - args.yfrom) / (args.xto-args.xfrom),
				toTheRight = (args.xto > args.xfrom),
				yFromX = function (x) { return args.yfrom + coeff * (x - args.xfrom); },
				xFromY = function (y) { return args.xfrom + (y - args.yfrom) / coeff; };
			
			args.yFromX = yFromX;
			args.xFromY = xFromY;
		}
	}
	
	args.length = Math.sqrt(Math.pow(args.xto - args.xfrom, 2) + Math.pow(args.yto - args.yfrom, 2));
	args.angle_radians = Math.atan2(args.yto-args.yfrom, args.xto-args.xfrom);
	args.angle_degrees = args.angle_radians * (180/Math.PI);
	
	return args;
}