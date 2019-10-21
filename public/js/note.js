/*
	Note class - a class that holds information about each note. A new Note object is created every time a note is placed.

    Copyright (C) 2019  Archie Maclean

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see https://www.gnu.org/licenses/.
*/

class Note {
    constructor(x,y,name,type,dotted,getActualCoords) {
		this.x = x;
        this.y = y;
		this.actual_x = getActualCoords(this.x,this.y)[0];	// this is the actual x value, along only the first stave. this.x holds the value that is visible on the canvas
		this.actual_y = getActualCoords(this.x,this.y)[1];	// this is the actual y value, y is just the value snapped to the line - starts off the same so dragging is fine
        this.type = type;
        this.name = name;
        this.width = 13;
        this.height = STAVELINEWIDTH;
		this.stem_height = 40;
		this.selected = false;
		this.connected_before = null;
		this.connected_after = null;
		this.dotted = dotted;
    }

    draw(snapToLine) {
		const {x,y,name} = snapToLine(this.actual_x,this.actual_y);
		this.name = name;
		this.drawHead(x,y);
		this.drawTail(x,y);
    }
	drawHead(x,y) {
		stroke(this.selected ? SELECTED_COLOUR : 0);
		strokeWeight(((this.type === 'semibreve') || (this.type === 'minim')) ? 2 : 0);
		this.selected ? fill(((this.type === 'semibreve') || (this.type === 'minim')) ? WHITE : SELECTED_COLOUR) : fill(((this.type === 'semibreve') || (this.type === 'minim')) ? WHITE : 0);
		ellipse(x,y,this.width,this.height);
		
		if (this.dotted) {
			fill(0); strokeWeight(0);
			let y_dif,x_dif;
			(['A','f','d','b','g'].includes(this.name)) ? y_dif = -4 : y_dif = 2;
			(['A','f','d','b','g'].includes(this.name)) ? x_dif = this.width/2+2 : x_dif = this.width/2+3;
			ellipse(x+x_dif,y+y_dif,4.5,4.5);
		}

		if (this.name === 'A') {
			strokeWeight(2);
            line(x-STAVELINEWIDTH+0.5,y,x+STAVELINEWIDTH-0.5,y);
        }
	}
	drawTail(x,y) {
		strokeWeight(2);
		if (this.type === 'semibreve') strokeWeight(0);
		if ((this.type != 'semibreve') && (this.type != 'minim')) strokeWeight(2); 

		const shift_left = this.width/2;
        line(x-(this.width/2),y,x-(this.width/2),y+this.stem_height);

		stroke(0);
		const num_of_tails = this.num_of_tails;
		let current_y = 0;
		let tail_image;
		this.selected ? tail_image=blue_note_tail : tail_image=note_tail;

		if (!(this.connected_before) && !(this.connected_after)) {
			for (let tailnum=0;tailnum<num_of_tails;tailnum++) {
				image(tail_image,x-shift_left,y+this.stem_height-20-9*current_y,10,25);
				current_y++;
			}
		} else {
			strokeWeight(4);
			for (const note of [this.connected_before,this.connected_after]) {
				current_y = 0;
				if (note == null) continue;
				const other_tail = note.num_of_tails;
				if ((num_of_tails === other_tail) && (x > note.x)) {
					for (let tailnum=0;tailnum<num_of_tails;tailnum++) {
						this.drawConnectingLine(note,current_y);
						current_y++;
					}
				} else if (num_of_tails > other_tail) {
					for (let tailnum=0;tailnum<other_tail;tailnum++) {
						this.drawConnectingLine(note,current_y);
						current_y++;
					}
					const distance = 10*((x > note.x) ? -1 : 1);
					for (let tailnum=0;tailnum<(num_of_tails-other_tail);tailnum++) {
						line(x-this.width/2,y+this.stem_height-10*current_y,x-this.width/2+distance,y+this.stem_height-10*current_y);
						current_y++;
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
	resetActualY(snapToLine) {
		const {x,y,name} = snapToLine(this.actual_x,this.actual_y);
		this.x = x;
		this.y = y;
		this.name = name;
	}
	deselect() {
		this.selected = false;
	}
	unConnect() {
		if (this.connected_after != null) {
			this.connected_after.connected_before = null;
			this.connected_after.stem_height = 40;
		}
		if (this.connected_before != null) {
			this.connected_before.connected_after = null;
			this.connected_before.stem_height = 40;
		}
		this.connected_after = null;
		this.connected_before = null;
		this.stem_height = 40;
	}
	drag(dx,dy,getActualCoords,snapToLine) {
		const old_y = this.y, old_x = this.x;
		this.x += dx;
		this.y += dy;
		const {x,y} = snapToLine(this.x,this.y);
		if (x == null || y == null) {
			this.x = old_x; this.y = old_y;
		} else {
			this.actual_x = getActualCoords(this.x,this.y)[0];
			this.actual_y = getActualCoords(this.x,this.y)[1];
		}
	}
}