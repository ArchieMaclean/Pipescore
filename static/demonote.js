class DemoNote {
    constructor() {
		this.x = mouseX;
		this.y = mouseY;
		this.col = [50,50,200,150];
		this.width = 15;
		this.height = 10;
		this.note = 'g';
		this.standard_gracenote = [{name: 'g'},{name:'d'},{name:'c'},{name:'d'}];
    }

    draw(menu_mode) {
		strokeWeight(0);
		fill(this.col);
		stroke(this.col);
		strokeWeight(2);
		if ((menu_mode != 'gracenote') || (this.standard_gracenote == null)) {
			ellipse(this.x,this.y,this.width,this.height);
			if (this.note === 'A') {
				line(this.x-11,this.y,this.x+11,this.y);
			}
		} else {
			let x = this.x;
			for (const note of this.standard_gracenote) {
				ellipse(x,note.y,this.width,this.height);
				if (note.name === 'A') {
					line(x-11,this.y,x+11,this.y);
				}
				x += 10;
			}
		}
    }

    update(snapToLine,menu_mode,getCoordFromNoteName) {
		if (menu_mode === 'note') {
			this.width = 15;
			this.height = 10;
		} else if (menu_mode === 'gracenote') {
			this.width = 7;
			this.height = 5;
		}
		this.x = mouseX;
		const {x,y,name} = snapToLine(mouseX,mouseY);
		if (y != null) {
			this.y = y;
			this.x = x;
			this.note = name;
		}

		if (this.standard_gracenote != null) {
			for (const note of this.standard_gracenote) {
				note.y = getCoordFromNoteName(note.name);
			}
		}
    }
}