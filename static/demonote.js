class DemoNote {
    constructor() {
	this.x = mouseX;
	this.y = mouseY;
	this.col = [50,50,200,150];
	this.width = 15;
	this.height = 10;
	this.note = "g";
    }

    draw() {
		fill(this.col);
		stroke(this.col);
		strokeWeight(2);
		ellipse(this.x,this.y,this.width,this.height);
		if (this.note=="A") {
			line(this.x-11,this.y,this.x+11,this.y);
		}
    }

    update(stave) {
		this.x = mouseX;
		var staveline = stave.snapToLine(mouseY);
		if (staveline!=null) {
			this.y = staveline[0];
			this.note = staveline[1];
		}
    }
}
