SVG.RNode = SVG.invent({
		create: function (...cells) {
			SVG.Nested.call(this);
			cells[0] = capitalizeFirstLetter(cells[0]);
			
			let titleText = cells[0];
			this.id(titleText);
			
			let nbCells = cells.length,
				textNodeTitleSizeFont = parseInt(window.refFontSize),
				textNodes = cells.map((x) => this.text(Array.isArray(x) ? x.join('\n') : x).setFontSize(0.9).fill('black')),
				vMargin = 10;

			let title = textNodes[0].setFontSize(1);
			this[0] = title; // use like an array
			
			let maxTextNodeWidth = Math.max(...textNodes.map(x => x.width())),
				hMargin = 10,
				backgroundWidth = hMargin + maxTextNodeWidth + hMargin;
			title.y(0.5 * vMargin).cx(backgroundWidth / 2);

			let backgroundHeight;
			if (nbCells === 1)
				backgroundHeight = title.y2() + vMargin;
			else {
				let currentSeparatorY = title.y2() + 0.5 * vMargin,
					y_separator,
					separator, 
					textNode;
				
				for (let i = 1; i < nbCells; i++) {
					separator = this.line(0, currentSeparatorY, backgroundWidth, currentSeparatorY).id("separator").stroke({ width: 1});
					textNode = textNodes[i].x(hMargin).y(separator.y2() + vMargin);
					this[i] = textNode; // use like an array

					currentSeparatorY = textNode.y2() + vMargin;
				}
				
				backgroundHeight = currentSeparatorY;
			}
			
			let background = this.rect(backgroundWidth, backgroundHeight)
				.fill("#F5D8BD")
				.id(titleText + "_background")
				.stroke({ width: 1})
				.back();

			this.background = background;
			this.title = title;
		},
		inherit: SVG.Nested,
		extend: {
			fill: function (arg) {
				this.background.fill(arg);
				return this;
			}
		},
		construct: {
			rnode: function (...cells) {
				let rnode = this.put(new SVG.RNode(...cells));

				this.doc().lastShape(rnode);
				return rnode;
			}
		}
	});
