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
			
			this.attr("depth", Math.max(1, maxChildFrameDepth + 1));
			
			let hMargin = 10 + 10 * maxChildFrameDepth,
				vMargin = 10 + 10 * maxChildFrameDepth;
				
				let background_x = x_min - hMargin,
					background_x2 = x2_max + hMargin,
					background_width = (background_x2 - background_x),
					background_y_without_title = y_min - vMargin,
					background_y2 = y2_max + vMargin;

				let title = this.text(content[0]).cx((background_x + background_x2) / 2).y2(background_y_without_title).underline();

				background_x = Math.min(background_x, title.x() - hMargin);
				background_x2 = Math.max(background_x2, title.x2() + hMargin);
				background_width = background_x2 - background_x;

				let background_y = background_y_without_title - title.height() - vMargin,
				background_height = (background_y2 - background_y);

				background
					.size(background_width, background_height)
					.x(background_x)
					.y(background_y);
				this.move(background_x, background_y);

				this.each(function (i, children) {
					this.translate(-1 * background_x, -1 * background_y);
				});

				this.title = title;
				this.background = background;
				return this;
		},
		inherit: SVG.Nested,
		construct: {
			frame: function (...content) {
				let frame = this.put(new SVG.Frame(...content)).back();
				
				this.doc().lastShape(frame);
				return frame;
			}
		}
	});