/*
	Gracenote class - a class that holds information about each gracenote. A new Gracenote object is created every time a gracenote is placed.

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
		
		strokeWeight(0);
		this.selected ? fill(SELECTED_COLOUR) : fill(BLACK);
		
		stroke(WHITE);
		ellipse(x,y,7,5);
		this.selected ? stroke(SELECTED_COLOUR) : stroke(BLACK);
		strokeWeight(1.5);
		if (name === 'A') {
			line(x-5.5,y,x+5.5,y);
		}

		group.sort((a,b) => (a.x > b.x) ? 1: -1);
		this.stem_height = 20;
		
		if (group.length === 1) {
			const stem_y = y - this.stem_height;
			line(x+3.5,stem_y,x+7,stem_y+5);
			line(x+3.5,stem_y+4,x+7,stem_y+9);
			line(x+3.5,stem_y+8,x+7,stem_y+13);

			line(x+3.5,y,x+3.5,stem_y);
		} else {
			let highest = Infinity;
			for (const note of group) {
				if ((note.y-this.stem_height) < highest) {
					highest = note.y-this.stem_height;
				}
			}
			this.stem_height = y-highest;
			const stem_y = y - this.stem_height;
			const first = group[0]; const last = group[group.length-1];
			line(first.x+3.5,stem_y,last.x+3.5,stem_y);
			line(first.x+3.5,stem_y+4,last.x+3.5,stem_y+4);
			line(first.x+3.5,stem_y+8,last.x+3.5,stem_y+8);

			line(x+3.5,y,x+3.5,stem_y);
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
		this.x += dx;
		this.y += dy;
		const actual_coords = getActualCoords(this.x,this.y);
		this.actual_x = actual_coords[0];
		this.actual_y = actual_coords[1];
	}
	deselect() {
		this.selected = false;
	}
	resetActualY(snapToLine) {
		const {x,y,name} = snapToLine(this.actual_x,this.actual_y);
		this.x = x;
		this.y = y;
		this.name = name;
	}
}