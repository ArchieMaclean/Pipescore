class Note {
    constructor(stave, x,actual_y,type,col) {
        this.x = x;
        this.y = stave.snapToLine(actual_y)[0];
		this.actual_y = this.y;	// this is the actual y value, y is just the value snapped to the line - starts off the same so dragging is fine
        this.type = type;
        this.name = stave.snapToLine(actual_y)[1];
        this.col = col;
        this.width = 15;
        this.height = 10;
		this.stem_height = 50;
		this.selected = false;
		this.connected = [];
    }

    draw() {
		var snapped = stave.snapToLine(this.actual_y);
		if (snapped != null) {
			this.y = snapped[0];	// snaps note to line
			this.name = snapped[1];
		}

        fill(this.col);
        if (this.selected) {
			stroke(SELECTED_COLOUR);
		} else {
			if ((this.type=="semibreve")||(this.type=="minim")) {
				stroke(0);
			} else {
				stroke(this.col);
			}
		}
        if (this.name=="A") {
			strokeWeight(2);
            line(this.x-11,this.y,this.x+11,this.y);
        }
		strokeWeight((this.type=="semibreve" || this.type=="minim") ? 2 : 0)
			/*
        switch (this.type) {
            case "semibreve": 
			case "minim":
				strokeWeight(2); break;
            default: strokeWeight(0);
        }
		*/
		if (this.selected) {
			switch (this.type) {
			case "semibreve":
			case "minim":
				fill(this.col); break;
			default: fill(SELECTED_COLOUR);
			}
		}
        ellipse(this.x,this.y,this.width,this.height);

        switch (this.type) {
            case "semibreve": strokeWeight(0); stroke(0); break;
            case "minim": stroke(0); break;
            default: strokeWeight(2); stroke(this.col);
        }
		if (this.selected) {
			stroke(SELECTED_COLOUR);
		}

        line(this.x-(this.width/2),this.y,this.x-(this.width/2),this.y+this.stem_height);

		let tail = this.tailSize;
		var y = 0;
		var tail_image;
		switch (this.selected) {
			case true: tail_image=blue_note_tail; break;
			default: tail_image=note_tail;
		}
		if (this.connected.length == 0) {
			for (var tailnum=0;tailnum<tail;tailnum++) {
				image(tail_image,this.x-this.width/2-2,this.y+this.stem_height-20-10*y,10,25);
				y++;
			}
		} else {
			strokeWeight(2);
			for (var note of this.connected) {
				let other_tail = note.tailSize;
				if (tail == other_tail && this.x>note.x) {
					for (var tailnum=0;tailnum<tail;tailnum++) {
						line(this.x-this.width/2,this.y+this.stem_height-10*y,note.x-note.width/2,note.y+note.stem_height-10*y);
						y++;
					}
				} else if (tail > other_tail) {
					for (var tailnum=0;tailnum<other_tail;tailnum++) {
						line(this.x-this.width/2,this.y+this.stem_height-10*y,note.x-note.width/2,note.y+note.stem_height-10*y);
						y++;
					}
					for (var tailnum=0;tailnum<(tail-other_tail);tailnum++) {
						line(this.x-this.width/2,this.y+this.stem_height-10*y,this.x-this.width/2-20,this.y+this.stem_height-10*y);
						y++;
					}
				}	
			}
		}
    }
    update(x=null,y=null,name=null) {
        if (x!=null) {
            this.x = x;
        }
        if (y!=null) {
            this.y = y;
        }
        if (name!=null) {
            this.name = name;
        }
    }
   checkIfSelected(x,y) {
       var top = this.y-this.height/2-CLICK_MARGIN;
       var bottom = this.y+this.height/2+CLICK_MARGIN;
       var left = this.x-this.width/2-CLICK_MARGIN;
       var right = this.x+this.width/2+CLICK_MARGIN;
       return ((x>left)&&(x<right)&&(y>top)&&(y<height));
   }
	addConnected(note) {
		let need_to_add = true;
		for (var selectednote of this.connected) {
			if (selectednote.x==note.x && selectednote.y==othernote.y) {
				need_to_add = false;
			}

		}
		if (need_to_add) {
			this.connected.push(note);
		}
	}
	get tailSize() {
		let tail;
		switch (this.type) {
			case "semibreve":
			case "minim":
			case "crotchet":
				tail=0; break;
			case "quaver": tail=1; break;
			case "semiquaver": tail=2; break;
			case "demisemiquaver": tail=3; break;
			default: console.log("Error!");
		}
		return tail;
	}
}


