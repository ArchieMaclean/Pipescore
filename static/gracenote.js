class Gracenote {
	constructor(x,y,snapToLine) {
		this.stem_height = 20;
		this.x = x;
		this.y = y;
		this.selected = false;
		this.snapped = snapToLine(this.y);
		if (this.snapped) {
			this.y = this.snapped[0];
			this.name = this.snapped[1];
		}
	}
	draw(snapToLine) {
		strokeWeight(0);
		this.notes = this.notes.sort((a,b) => (a.x > b.x)? 1 : -1);
		const stem_y = this.y + this.stem_height;
		this.selected ? fill(SELECTED_COLOUR) : fill(BLACK);
		this.y = (snapToLine(this.actual_y) != null) ? snapToLine(this.actual_y)[0] : this.y;
		this.name = (snapToLine(this.actual_y) != null) ? snapToLine(this.actual_y)[1] : this.name;
		
		stroke(WHITE);
		ellipse(this.x,this.y,7,5);
		stroke(BLACK);
		strokeWeight(1.5);
		line(this.x+3.5,this.y,this.x+3.5,stem_y);
		if (this.name === 'A') {
			line(this.x-4.5,this.y,this.x+4.5,this.y);
		}
	}
	checkIfSelected() {
		if (((this.x-CLICK_MARGIN) < mouseX) && ((this.x+CLICK_MARGIN) > mouseX) && ((this.y-CLICK_MARGIN) < mouseY) && ((this.y+CLICK_MARGIN)>mouseY)) {
			this.selected = true;
			return true;
		}
		return false;
	}
	dragSelected(dx,dy) {
		this.x += dx;
		this.y += dy;
	}
	deselect() {
		this.selected = false;
	}
}