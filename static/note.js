class Note {
    constructor(x,actual_y,name,type,dotted,getActualCoords) {
		this.x = x;
        this.y = actual_y;
		this.actual_x = getActualCoords(this.x,this.y)[0];	// this is the actual x value, along only the first stave. this.x holds the value that is visible on the canvas
		this.actual_y = getActualCoords(this.x,this.y)[1];	// this is the actual y value, y is just the value snapped to the line - starts off the same so dragging is fine
        this.type = type;
        this.name = name;
        this.width = 15;
        this.height = 10;
		this.stem_height = 50;
		this.selected = false;
		this.connected_before = null;
		this.connected_after = null;
		this.dotted = dotted;
    }

    draw(snapToLine) {
		const {x,y,name} = snapToLine(this.actual_x,this.actual_y);
		if (y != null) {
			this.x = x;
			this.y = y-STAVEWIDTH;	// Don't know why I have to minus STAVEWIDTH - it works fine with demo note :(
			this.name = name;
		}
		this.drawHead();
		this.drawTail();
    }
	drawHead() {
		stroke(this.selected ? SELECTED_COLOUR : 0);
		strokeWeight(((this.type === 'semibreve') || (this.type === 'minim')) ? 2 : 0);
		this.selected ? fill(((this.type === 'semibreve') || (this.type === 'minim')) ? WHITE : SELECTED_COLOUR) : fill(((this.type === 'semibreve') || (this.type === 'minim')) ? WHITE : 0);
		ellipse(this.x,this.y,this.width,this.height);
		
		if (this.dotted) {
			fill(0); strokeWeight(0);
			let y_dif;
			(['A','f','d','b','g'].includes(this.name)) ? y_dif = -4 : y_dif = 3;
			ellipse(this.x+this.width/2+2,this.y+y_dif,4.5,4.5);
		}

		if (this.name === 'A') {
			strokeWeight(2);
            line(this.x-11,this.y,this.x+11,this.y);
        }
	}
	drawTail() {
		if (this.type === 'semibreve') strokeWeight(0);
		if ((this.type != 'semibreve') && (this.type != 'minim')) strokeWeight(2); 
        line(this.x-(this.width/2),this.y,this.x-(this.width/2),this.y+this.stem_height);

		stroke(0);
		const num_of_tails = this.num_of_tails;
		let y = 0;
		let tail_image;
		this.selected ? tail_image=blue_note_tail : tail_image=note_tail;

		if (!(this.connected_before) && !(this.connected_after)) {
			for (let tailnum=0;tailnum<num_of_tails;tailnum++) {
				image(tail_image,this.x-this.width/2-2,this.y+this.stem_height-20-10*y,10,25);
				y++;
			}
		} else {
			strokeWeight(4);
			for (const note of [this.connected_before,this.connected_after]) {
				y = 0;
				if (note == null) continue;
				const other_tail = note.num_of_tails;
				if ((num_of_tails === other_tail) && (this.x > note.x)) {
					for (let tailnum=0;tailnum<num_of_tails;tailnum++) {
						this.drawConnectingLine(note,y);
						y++;
					}
				} else if (num_of_tails > other_tail) {
					for (let tailnum=0;tailnum<other_tail;tailnum++) {
						this.drawConnectingLine(note,y);
						y++;
					}
					const distance = 10*((this.x > note.x) ? -1 : 1);
					for (let tailnum=0;tailnum<(num_of_tails-other_tail);tailnum++) {
						line(this.x-this.width/2,this.y+this.stem_height-10*y,this.x-this.width/2+distance,this.y+this.stem_height-10*y);
						y++;
					}
				}	
			}
		}
	}
	drawConnectingLine(note,y) {
		line(this.x-this.width/2,this.y+this.stem_height-10*y,note.x-note.width/2,note.y+note.stem_height-10*y);
	}
   	checkIfSelected(x,y) {
	   	const top = this.y-this.height/2-CLICK_MARGIN;
	   	const bottom = this.y+this.height/2+CLICK_MARGIN;
	   	const left = this.x-this.width/2-CLICK_MARGIN;
	   	const right = this.x+this.width/2+CLICK_MARGIN;
	   	return ((x > left) && (x < right) && (y > top) && (y < bottom));
   	}
	addConnected(note) {
		if ((this.num_of_tails === 0) || (note.num_of_tails === 0)) return;
		if (note.x < this.x) this.connected_before = note;
		else this.connected_after = note;
	}
	get num_of_tails() {
		switch (this.type) {
			case 'quaver': return 1;
			case 'semiquaver': return 2;
			case 'demisemiquaver': return 3;
			default: return 0;
		}
	}
	resetActualY() {
		this.actual_y = this.y;
	}
	deselect() {
		this.selected = false;
	}
	unConnect() {
		if (this.connected_after != null) this.connected_after.connected_before = null;
		if (this.connected_before != null) this.connected_before.connected_after = null;
		this.connected_after = null;
		this.connected_before = null;
		this.stem_height = 50;
	}
}