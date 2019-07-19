SVG.Frame = SVG.invent({
		create: function (...content) {
			SVG.Nested.call(this);

			let background = this.rect().fill('white').stroke({ width: 1});
			let x_min = Number.MAX_SAFE_INTEGER,
				x2_max = Number.MIN_SAFE_INTEGER,
				y_min = Number.MAX_SAFE_INTEGER,
				y2_max = Number.MIN_SAFE_INTEGER,
				maxChildFrameDepth = 0;
			
			for (let node of content.splice(1)) {
				if (node.x() < x_min)
					x_min = node.x();
				if (node.x2() > x2_max)
					x2_max = node.x2();
				if (node.y() < y_min)
					y_min = node.y();
				if (node.y2() > y2_max)
					y2_max = node.y2();
				if (node instanceof SVG.Frame)
					maxChildFrameDepth = Math.max(node.attr("depth"), maxChildFrameDepth);
				this.add(node);
			}
			
			let depth = Math.max(1, maxChildFrameDepth + 1);
			this.attr("depth", Math.max(1, maxChildFrameDepth + 1));
			
			let hMargin = 10 + 10 * maxChildFrameDepth,
				vMargin = 10 + 10 * maxChildFrameDepth,
				extraVMargin = 2,
				underlineHeight = 3;
				
				let background_x = x_min - hMargin,
					background_x2 = x2_max + hMargin,
					background_width = (background_x2 - background_x),
					background_y_without_title = y_min - (vMargin + extraVMargin) - underlineHeight,
					background_y2 = y2_max + vMargin;

				let titleText = capitalizeFirstLetter(content[0]);
				let title = this.text(titleText).id(titleText + "_title")
					.setFontSize(window.refFontSize + 2 * depth)
					.cx((background_x + background_x2) / 2).y2(background_y_without_title);
				
				this.id(titleText);
				
				background_x = Math.min(background_x, title.x() - hMargin);
				background_x2 = Math.max(background_x2, title.x2() + hMargin);
				background_width = background_x2 - background_x;

				let background_y = background_y_without_title - title.height() - vMargin,
				background_height = (background_y2 - background_y);

				background
					.id(titleText + "_background")
					.size(background_width, background_height)
					.x(background_x)
					.y(background_y);
				
				this.move(background_x, background_y);

				this.each(function (i, children) {
					this.dx(-1 * background_x).dy(-1 * background_y);
				});

				this.title = title;
				this.background = background;
				
				let backgroundColor,
					textColor = "black";
				switch (depth) {
					case 1:
						backgroundColor = "#D6BA73";
						break;
					case 2:
						backgroundColor = "#8BBF9F";
						break;
					case 3:
						backgroundColor = "#857E7B";
						break;
					case 4:
						backgroundColor = "#59344F";
						textColor = "white";
						break;
					case 5:
						backgroundColor = "#011936";
						textColor = "white";
						break;
					case 6:
						backgroundColor = "#f4fffd";
						break;
					case 7:
						backgroundColor = "#f9dc5c";
						break;
					case 8:
						backgroundColor = "#52414c";
						textColor = "white";
						break;
					default:
						backgroundColor = "#596157";
						textColor = "white";
						break;
				}
				background.fill(backgroundColor);
				title.fill(textColor).underline();
				return this;
		},
		inherit: SVG.Nested,
		extend: {
			fill: function(fill) {
				this.background.fill(fill);
				return this;
			}
		},
		construct: {
			frame: function (...content) {
				let frame = this.put(new SVG.Frame(...content)).back();
				
				this.doc().lastShape(frame);
				return frame;
			},
			background: function(...content) {
				return this.put(new SVG.Frame(...content)).id("globalBackground").back();
			}
		}
	});