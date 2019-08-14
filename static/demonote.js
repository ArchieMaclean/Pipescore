class DemoNote {
    constructor() {
		this.x = mouseX;
		this.y = mouseY;
		this.col = [50,50,200,150];
		this.width = 15;
		this.height = 10;
		this.ledger = 11;
		this.note = 'g';
		this.standard_gracenote = null;
    }

    draw(menu_mode,getCoordFromNoteName,getStavenum) {
		strokeWeight(0);
		fill(this.col);
		stroke(this.col);
		strokeWeight(2);
		if ((menu_mode != 'gracenote') || (this.standard_gracenote == null)) {
			ellipse(this.x,this.y,this.width,this.height);
			if (this.note === 'A') {
				line(this.x-this.ledger,this.y,this.x+this.ledger,this.y);
			}
		} else {
			let x = this.x;
			for (const note of this.standard_gracenote) {
				ellipse(x,getCoordFromNoteName(note,getStavenum(this.y)),this.width,this.height);
				if (note === 'A') {
					line(x-this.ledger,this.y,x+this.ledger,this.y);
				}
				x += 10;
			}
		}
    }

    update(snapToLine,menu_mode) {
		if (menu_mode === 'note') {
			this.width = 15;
			this.height = 10;
			this.ledger = 11;
			this.standard_gracenote = null;
		} else if (menu_mode === 'gracenote') {
			this.width = 7;
			this.height = 5;
			this.ledger = 5.5;
			if (document.querySelector('#place-gracenote').checked) {
				const gracenote_type = document.querySelector('#gracenote-type').value;
				this.standard_gracenote = this.getStandardGracenote(gracenote_type);
			} else {
				this.standard_gracenote = null;
			}
		}
		this.x = mouseX;
		const {x,y,name} = snapToLine(mouseX,mouseY);
		if (y != null) {
			this.y = y;
			this.x = x;
			this.note = name;
		}
	}
	getStandardGracenote(grace) {
		switch (grace) {
			case 'd-throw': return ['g','d','c'];
			case 'b-doubling': return ['G','b','d'];
			case 'c-doubling': return ['G','c','d'];
			case 'd-doubling': return ['G','d','e'];
			case 'e-doubling': return ['G','e','f'];
			case 'f-doubling': return ['G','f','G'];
			default: return ['G','c','d'];
		}
	}
}