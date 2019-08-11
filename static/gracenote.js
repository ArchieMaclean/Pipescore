class Gracenote {
	constructor(x,y,name,getActualCoords) {
		this.stem_height = 20;
		this.x = x;
		this.y = y;
		this.actual_x = getActualCoords(this.x,this.y)[0];
		this.actual_y = getActualCoords(this.x,this.y)[1];
		this.name = name;
		this.selected = false;
	}
	draw(snapToLine,group) {
		const {x,y,name} = snapToLine(this.actual_x,this.actual_y);
		this.y = (y != null) ? y : this.y;
		this.x = (x != null) ? x : this.x;
		this.name = (y != null) ? name : this.name;
		
		strokeWeight(0);
		this.selected ? fill(SELECTED_COLOUR) : fill(BLACK);
		
		stroke(WHITE);
		ellipse(this.x,this.y,7,5);
		this.selected ? stroke(SELECTED_COLOUR) : stroke(BLACK);
		strokeWeight(1.5);
		if (this.name === 'A') {
			line(this.x-5.5,this.y,this.x+5.5,this.y);
		}

		group.sort((a,b) => (a.x > b.x) ? 1: -1);
		this.stem_height = 20;
		
		if (group.length === 1) {
			const stem_y = this.y - this.stem_height;
			line(this.x+3.5,stem_y,this.x+7,stem_y+5);
			line(this.x+3.5,stem_y+4,this.x+7,stem_y+9);
			line(this.x+3.5,stem_y+8,this.x+7,stem_y+13);

			line(this.x+3.5,this.y,this.x+3.5,stem_y);
		} else {
			let highest = Infinity;
			for (const note of group) {
				if ((note.y-this.stem_height) < highest) {
					highest = note.y-this.stem_height;
				}
			}
			this.stem_height = this.y-highest;
			const stem_y = this.y - this.stem_height;
			const first = group[0]; const last = group[group.length-1];
			line(first.x+3.5,stem_y,last.x+3.5,stem_y);
			line(first.x+3.5,stem_y+4,last.x+3.5,stem_y+4);
			line(first.x+3.5,stem_y+8,last.x+3.5,stem_y+8);

			line(this.x+3.5,this.y,this.x+3.5,stem_y);
		}
	}
	checkIfSelected() {
		if (((this.x-CLICK_MARGIN) < mouseX) && ((this.x+CLICK_MARGIN) > mouseX) && ((this.y-CLICK_MARGIN) < mouseY) && ((this.y+CLICK_MARGIN)>mouseY)) {
			this.selected = true;
			return true;
		}
		return false;
	}
	drag(dx,dy,getActualCoords) {
		this.actual_x += dx;
		this.actual_y += dy;
		const actual_coords = getActualCoords(this.actual_x,this.actual_y);
		this.actual_x = actual_coords[0];
		this.actual_y = actual_coords[1];
	}
	deselect() {
		this.selected = false;
	}
	resetActualY() {
		this.actual_y = this.y;
	}
}