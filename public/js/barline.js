/*
    Barline class - A class that holds information about each barline. A new Barline object is instantiated when a new barline is created.

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

class Barline {
    constructor(x,y,stave) {
        this.offset = stave.offset;
        this.stave_width = width-2*MARGIN;

        const actual_coords = this.getActualCoord(x,y);
        this.actual_x = actual_coords[0];
        this.actual_y = actual_coords[1];

        this.x = x;
        this.y = y;
        this.selected = false;

        this.click_margin = 10;
    }
    draw() {
        // For some reason, barlines added with button have furry edges
        (this.selected) ? stroke(SELECTED_COLOUR) : stroke(0);
        strokeWeight(2);
        fill(0);
        const [x,y] = this.getCanvasCoord(this.actual_x,this.actual_y);
        if (!this.selected) {
            this.x = x;
            this.y = y;
        }
        line(x,y,x,y+4*STAVELINEWIDTH);
    }
    getActualCoord(x,y) {
        const height = Math.floor((y+STAVEWIDTH/2-this.offset)/STAVEWIDTH);
        const stave_height = (height < 0) ? 0 : height;
        x += stave_height*width;
        y = 0;
        return [x,y];
    }
    getCanvasCoord(x,y) {
        let new_x = x%width;
        if (new_x > (MARGIN+this.stave_width)) new_x = MARGIN+this.stave_width;
        if (new_x < MARGIN) new_x = MARGIN;
        const new_y = Math.floor(x/width)*STAVEWIDTH+this.offset;
        return [new_x,new_y];
    }
    drag(dx,dy) {
        this.x += dx;
        this.y += dy;
        const actual_coords = this.getActualCoord(this.x,this.y);
        this.actual_x = actual_coords[0];
        this.actual_y = actual_coords[1];
    }
    checkIfSelected(x,y) {
        const margin = this.click_margin;
        if ((x > (this.x-margin)) && (x < (this.x+margin)) && (y > this.y) && (y < (this.y+4*STAVELINEWIDTH))) return true;
        return false;
    }
    reset() {
        this.x,this.y = this.getCanvasCoord(this.actual_x,this.actual_y);
    }
    deselect() {
        this.selected = false;
    }
}