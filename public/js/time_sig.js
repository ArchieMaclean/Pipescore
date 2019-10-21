/*
    TimeSignature class - this class holds information about each time signature. A new TimeSignature object is created each time a time signature is placed.

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

class TimeSignature extends Barline {
    constructor(x,y,stave) {
        super(x,y,stave);
        this.getNumsFromUI();
        this.click_margin = 10;
    }
    getNumsFromUI() {
        this.numerator = parseInt(document.querySelector('#timesig-num').value);
        this.denominator = parseInt(document.querySelector('#timesig-den').value);
    }
    draw() {
        const [x,y] = this.getCanvasCoord(this.actual_x,this.actual_y);
        if (!this.selected) {
            this.x = x;
            this.y = y;
        } else {
            this.getNumsFromUI();
        }
        (this.selected) ? fill(SELECTED_COLOUR) : fill(0);
        const num_text = `${this.numerator}`;
        const den_text = `${this.denominator}`;
        strokeWeight(0);
        textAlign(CENTER);
        textStyle(NORMAL);
        textSize(22);
        textFont(time_sig_font);
        const shove = 8;
        text(num_text,x,y-shove);
        text(den_text,x,y+STAVELINEWIDTH*2.2-shove);

        textFont('Montserrat');
    }
    select() {
        this.selected = true;
        document.querySelector('#timesig-num').value = this.numerator;
        document.querySelector('#timesig-den').value = this.denominator;
    }
}
