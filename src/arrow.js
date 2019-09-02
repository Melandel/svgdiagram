	SVG.Arrow = SVG.invent({
		create: function (config) {
			let that = this;
			SVG.Nested.call(this);
			
			let xTop = Math.min(config.xfrom, config.xto),
				yLeft = Math.min(config.yfrom, config.yto),
				xInThis = config.xfrom-xTop,
				yInThis = config.yfrom-yLeft;
				
			this.move(xTop, yLeft);
			
			switch (config.type) {
				case "dash":
					this.path(`
						M ${xInThis} ${yInThis}
						L ${xInThis + config.length} ${yInThis}
					`).rotate(config.angle_degrees, xInThis, yInThis)
					  .stroke(config.color ||'#303030')
					  .fill("none")
					  .attr({"stroke-miterlimit": 50, "stroke-dasharray": "3 3"});
					  
					this.path(`
						M ${xInThis + config.length - 10} ${yInThis - 0.5 -5}
						L ${xInThis + config.length} ${yInThis}
						L ${xInThis + config.length - 10} ${yInThis + 0.5 +5}
						Z
					`).rotate(config.angle_degrees, xInThis, yInThis)
					  .fill(config.color ||'#303030');
					  
					if (config.caption) {
						this.text(config.caption)
							.setFontSize(0.8)
							.cx(xInThis + 0.5 * (config.xto - config.xfrom)  + 12 * Math.cos(config.angle_radians - 0.5 * Math.PI))
							.cy(yInThis + 0.5 * (config.yto - config.yfrom)  + 12 * Math.sin(config.angle_radians - 0.5 * Math.PI))
							.fill(config.color ||'#303030');
					}
				break;
				
				case "backAndForth":
					//forth
					let yInThisLeft = yInThis - 10;
					this.path(`
						M ${xInThis} ${yInThisLeft - 0.5}
						L ${xInThis + config.length - 5} ${yInThisLeft - 0.5}
						L ${xInThis + config.length - 10} ${yInThisLeft - 0.5 -5}
						L ${xInThis + config.length} ${yInThisLeft}
						L ${xInThis + config.length - 10} ${yInThisLeft + 0.5 +5}
						L ${xInThis + config.length - 5} ${yInThisLeft + 0.5}
						L ${xInThis} ${yInThisLeft + 0.5}
						Z
					`).rotate(config.angle_degrees, xInThis, yInThis)
					  .fill(config.color ||'#303030');
					
					//back
					let yInThisRight = yInThis + 10;
					this.path(`
						M ${xInThis} ${yInThisRight}
						L ${xInThis + config.length} ${yInThisRight}
					`).rotate(config.angle_degrees, xInThis, yInThis)
					  .stroke(config.color ||'#303030')
					  .fill("none")
					  .attr({"stroke-miterlimit": 50, "stroke-dasharray": "3 3"});

					this.path(`
						M ${xInThis + 5} ${yInThisRight - 0.5}
						L ${xInThis + 10} ${yInThisRight - 0.5 -5}
						L ${xInThis} ${yInThisRight}
						L ${xInThis + 10} ${yInThisRight + 0.5 +5}
						L ${xInThis + 5} ${yInThisRight + 0.5}
						Z
					`).rotate(config.angle_degrees, xInThis, yInThis)
					  .fill(config.color ||'#303030');
					 
					if (config.caption) {
						let captions = config.caption.split("|"),
							cx1 = xInThis + 0.5 * (config.xto - config.xfrom)  + 25 * Math.cos(config.angle_radians - 0.5 * Math.PI),
							cy1 = yInThisLeft + 0.5 * (config.yto - config.yfrom)  + 25 * Math.sin(config.angle_radians - 0.5 * Math.PI);
						this.text(captions[0])
							.setFontSize(0.8)
							.cx(cx1)
							.cy(cy1)
							.fill(config.color ||'#303030');
						
						if (captions.length > 1) {
							let dist = 20,
								cx2 = xInThis + 0.5 * (config.xto - config.xfrom)  + 25 * Math.cos(config.angle_radians + 0.5 * Math.PI),
								cy2 = yInThisRight + 0.5 * (config.yto - config.yfrom)  + 25 * Math.sin(config.angle_radians + 0.5 * Math.PI);
							this.text(captions[1])
								.setFontSize(0.8)
								.cx((cx2 > cx1) ? Math.max(cx2, cx1 + dist) : Math.min(cx2, cx1 - dist))
								.cy((cy2 > cy1) ? Math.max(cy2, cy1 + dist) : Math.min(cy2, cy1 - dist))
								.fill(config.color ||'#303030');
						}
					}
				break;
				
				case "simple":
				default:
					this.path(`
						M ${xInThis} ${yInThis - 0.5}
						L ${xInThis + config.length - 5} ${yInThis - 0.5}
						L ${xInThis + config.length - 10} ${yInThis - 0.5 -5}
						L ${xInThis + config.length} ${yInThis}
						L ${xInThis + config.length - 10} ${yInThis + 0.5 +5}
						L ${xInThis + config.length - 5} ${yInThis + 0.5}
						L ${xInThis} ${yInThis + 0.5}
						Z
					`).rotate(config.angle_degrees, xInThis, yInThis)
					  .fill(config.color ||'#303030');
					
					if (config.caption) {
						this.text(config.caption)
							.setFontSize(0.8)
							.cx(xInThis + 0.5 * (config.xto - config.xfrom)  + 12 * Math.cos(config.angle_radians - 0.5 * Math.PI))
							.cy(yInThis + 0.5 * (config.yto - config.yfrom)  + 12 * Math.sin(config.angle_radians - 0.5 * Math.PI))
							.fill(config.color ||'#303030');
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
		args.caption = options;
		args.type = args.caption.includes("|") ? "backAndForth" : "simple";
	}
	else {
		for (let prop in options)
			args[prop] = options[prop];
		
		if (options.caption && options.caption.includes("|"))
			args.type = "backAndForth";
		else
			args.type = options.type || "simple";
		
		let isFromCenter = false;
		switch (options.from) {
			case "e":
				args.xfrom = fromNode.X2();
				args.yfrom = fromNode.CY();
				break;
			case "s":
				args.xfrom = fromNode.CX();
				args.yfrom = fromNode.Y2();
				break;
			case "w":
				args.xfrom = fromNode.X();
				args.yfrom = fromNode.CY();
				break;
			case "n":
				args.xfrom = fromNode.CX();
				args.yfrom = fromNode.Y();
				break;
			case "ne":
				args.xfrom = fromNode.X2();
				args.yfrom = fromNode.Y();
				break;
			case "nw":
				args.xfrom = fromNode.X();
				args.yfrom = fromNode.Y();
				break;
			case "se":
				args.xfrom = fromNode.X2();
				args.yfrom = fromNode.Y2();
				break;
			case "sw":
				args.xfrom = fromNode.X();
				args.yfrom = fromNode.Y2();
				break;
			case "ese":
				args.xfrom = fromNode.X2();
				args.yfrom = fromNode.Y() + 0.75 * (fromNode.Y2() - fromNode.Y());
				break;
			case "sse":
				args.xfrom = fromNode.X() + 0.75 * (fromNode.X2() - fromNode.X());
				args.yfrom = fromNode.Y2();
				break;
			case "ssw":
				args.xfrom = fromNode.X() + 0.25 * (fromNode.X2() - fromNode.X());
				args.yfrom = fromNode.Y2();
				break;
			case "wsw":
				args.xfrom = fromNode.X();
				args.yfrom = fromNode.Y() + 0.75 * (fromNode.Y2() - fromNode.Y());
				break;
			case "wnw":
				args.xfrom = fromNode.X();
				args.yfrom = fromNode.Y() + 0.25 * (fromNode.Y2() - fromNode.Y());
				break;
			case "nnw":
				args.xfrom = fromNode.X() + 0.25 * (fromNode.X2() - fromNode.X());
				args.yfrom = fromNode.Y();
				break;
			case "nne":
				args.xfrom = fromNode.X() + 0.75 * (fromNode.X2() - fromNode.X());
				args.yfrom = fromNode.Y();
				break;
			case "ene":
				args.xfrom = fromNode.X2();
				args.yfrom = fromNode.Y() + 0.25 * (fromNode.Y2() - fromNode.Y());
				break;
			default:
				isFromCenter = true;
				break;
		}
		
		let isToCenter = false;
		switch (options.to) {
			case "e":
				args.xto = toNode.X2();
				args.yto = toNode.CY();
				break;
			case "s":
				args.xto = toNode.CX();
				args.yto = toNode.Y2();
				break;
			case "w":
				args.xto = toNode.X();
				args.yto = toNode.CY();
				break;
			case "n":
				args.xto = toNode.CX();
				args.yto = toNode.Y();
				break;
			case "ne":
				args.xto = toNode.X2();
				args.yto = toNode.Y();
				break;
			case "nw":
				args.xto = toNode.X();
				args.yto = toNode.Y();
				break;
			case "se":
				args.xto = toNode.X2();
				args.yto = toNode.Y2();
				break;
			case "sw":
				args.xto = toNode.X();
				args.yto = toNode.Y2();
				break;
			case "ese":
				args.xto = toNode.X2();
				args.yto = toNode.Y() + 0.75 * (toNode.Y2() - toNode.Y());
				break;
			case "sse":
				args.xto = toNode.X() + 0.75 * (toNode.X2() - toNode.X());
				args.yto = toNode.Y2();
				break;
			case "ssw":
				args.xto = toNode.X() + 0.25 * (toNode.X2() - toNode.X());
				args.yto = toNode.Y2();
				break;
			case "wsw":
				args.xto = toNode.X();
				args.yto = toNode.Y() + 0.75 * (toNode.Y2() - toNode.Y());
				break;
			case "wnw":
				args.xto = toNode.X();
				args.yto = toNode.Y() + 0.25 * (toNode.Y2() - toNode.Y());
				break;
			case "nnw":
				args.xto = toNode.X() + 0.25 * (toNode.X2() - toNode.X());
				args.yto = toNode.Y();
				break;
			case "nne":
				args.xto = toNode.X() + 0.75 * (toNode.X2() - toNode.X());
				args.yto = toNode.Y();
				break;
			case "ene":
				args.xto = toNode.X2();
				args.yto = toNode.Y() + 0.25 * (toNode.Y2() - toNode.Y());
				break;
			default:
				isToCenter = true;
				break;
		}
		
		if (isFromCenter || isToCenter) {
			let x1, y1, x2, y2;
			if (isFromCenter && isToCenter) {             x1 = fromNode.CX(); y1 = fromNode.CY(); x2 = toNode.CX(); y2 =toNode.CY(); }
			else if (isFromCenter && !isToCenter) {       x1 = fromNode.CX(); y1 = fromNode.CY(); x2 = args.xto;    y2 = args.yto;   }
			else { /* if (!isFromCenter && isToCenter) */ x1 = args.xfrom;    y1 = args.yfrom;    x2 = toNode.CX(); y2 =toNode.CY(); }
			
			let coeff = (y2 - y1) / (x2-x1),
				toTheRight = (x2 > x1),
				yFromX = function (x) { return y1 + coeff * (x - x1); },
				xFromY = function (y) { return x1 + (y - y1) / coeff; };
			
			args.yFromX = yFromX;
			args.xFromY = xFromY;
	
			if (isFromCenter) {
				let xfromCandidate = (x2 > x1) ? fromNode.X2() : fromNode.X(),
					yfromCandidate = (y2 > y1) ? fromNode.Y2() : fromNode.Y(),
					yMatchingToXCandidate = yFromX(xfromCandidate);
					
				if (yMatchingToXCandidate >= fromNode.Y() && yMatchingToXCandidate <= fromNode.Y2()) {
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
				let xtoCandidate = (x2 > x1) ? toNode.X() : toNode.X2(),
					ytoCandidate = (y2 > y1) ? toNode.Y() : toNode.Y2(),
					yMatchingToXCandidate = yFromX(xtoCandidate);
					
				if (yMatchingToXCandidate >= toNode.Y() && yMatchingToXCandidate <= toNode.Y2()) {
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
