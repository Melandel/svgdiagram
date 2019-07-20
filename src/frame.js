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
				if (node.X() < x_min)
					x_min = node.X();
				if (node.X2() > x2_max)
					x2_max = node.X2();
				if (node.Y() < y_min)
					y_min = node.Y();
				if (node.Y2() > y2_max)
					y2_max = node.Y2();
				if (node instanceof SVG.Frame)
					maxChildFrameDepth = Math.max(node.attr("depth"), maxChildFrameDepth);
				this.add(node);
			}
			
			let depth = Math.max(1, maxChildFrameDepth + 1);
			this.attr("depth", Math.max(1, maxChildFrameDepth + 1));
			
			let hMarginBase = 10,
				hMargin = hMarginBase + 10 * maxChildFrameDepth,
				vMarginBase = 10,
				vMargin = vMarginBase + 10 * maxChildFrameDepth,
				extraVMargin = 2,
				underlineHeight = 3;
				
				let background_x = x_min - hMargin,
					background_x2 = x2_max + hMargin,
					background_width = (background_x2 - background_x),
					background_y_without_title = y_min - (vMargin + extraVMargin) - underlineHeight,
					background_y2 = y2_max + vMarginBase;

				let titleText = capitalizeFirstLetter(content[0]);
				let title = this.text(titleText).id(titleText + "_title")
					.setFontSize(window.refFontSize + 2 * depth)
					.cx((background_x + background_x2) / 2).y2(background_y_without_title);
				
				this.id(titleText);
				
				background_x = Math.min(background_x, title.X() - hMargin);
				background_x2 = Math.max(background_x2, title.X2() + hMargin);
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
					if (!this.attr("X")) {
						this.attr("X", this.x());
						this.attr("Y", this.y());
					}
					this.dx(-1 * background_x).dy(-1 * background_y);
				});

				this.title = title;
				this.background = background;
				
				let backgroundColor,
					textColor = "black";
				switch (depth) {
					case 1:
						backgroundColor = "#ADD9E7";
						break;
					case 2:
						// backgroundColor = "#B5DCE8";
						backgroundColor = "#eaf4f4";
						break;
					case 3:
						// backgroundColor = "#BDDFEA";
						backgroundColor = "#f2f6d0";
						break;
					case 4:
						backgroundColor = "#e4be9e";
						break;
					case 5:
						backgroundColor = "#ffc09f";
						break;
					case 6:
						backgroundColor = "#fcde9c";
						break;
					case 7:
						backgroundColor = "#bbbe64";
						break;
					case 8:
						backgroundColor = "#dff2d8";
						break;
					case 9:
						backgroundColor = "#cfe8ef";
						break;
					default:
						backgroundColor = "#a1d2ce";
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