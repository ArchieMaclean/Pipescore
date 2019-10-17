/*
	DemoNote class - a class that deals with the blue note that follows the mouse and snaps to the stave.

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