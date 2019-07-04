SVG.RNode = SVG.invent({
		create: function (text) {
			SVG.Nested.call(this);
			this.id(text);

			let content = this.text(text).id(text + "_content");
			let background = this.rect(content.width() + 10, content.height() + 4).fill("lightgreen").id(text + "_background");
			content.cx(background.cx()).cy(background.cy());

			background.back();
			
			this.background = background;
			this.content = content;
		},
		inherit: SVG.Nested,
		extend: {
			fill: function (arg) {
				this.background.fill(arg);
				return this;
			}
		},
		construct: {
			rnode: function (text) {
				let rnode = this.put(new SVG.RNode(text));

				this.doc().lastShape(rnode);
				return rnode;
			}
		}
	});
