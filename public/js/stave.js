/*
    Stave class - this class deals with drawing the stave, and stave-related functions (e.g. snapping to line).

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

class Stave {
    constructor(setup=true,json=null) {
        if (setup) {
            this.offset = STAVEWIDTH;
            this.num_staves = 3;
        } else {
            this.offset = json.offset;
            this.num_staves = json.num_staves;
        }
        this.getCoordFromNoteName = this.getCoordFromNoteName.bind(this);
        this.getActualCoordFromCanvasCoord = this.getActualCoordFromCanvasCoord.bind(this);
        this.getStavenum = this.getStavenum.bind(this);
    }
    draw() {
        stroke(0);
        strokeWeight(2);
        for (let stavenum=0;stavenum<this.num_staves;stavenum++) {
            image(trebleClef,MARGIN-5,this.offset+stavenum*STAVEWIDTH,50,64);
            for (let linenum=0;linenum<5;linenum++) {
                const y = stavenum*STAVEWIDTH+linenum*STAVELINEWIDTH+this.offset;
                line(MARGIN,y,width-MARGIN,y);
            }
        }
    }
    getNoteFromLine(line, inbetween=false) {
        const notes = ['g','a','b','c','d','e','f','G','A']
		let thenote = (-2*line)+6;
        if (inbetween) thenote += 1;
        return notes[thenote];
    }
    getStavenum(y) {
        y -= this.offset;
        return (Math.floor(y/STAVEWIDTH) < 0) ? 0 : Math.floor(y/STAVEWIDTH);
    }
    getSnappedCoordFromCanvasCoord(x,y) {
        const position = {x:null,y:null,name:null};
        if (y < 0) return position;
        let stave_y;
        stavebreak:
        for (let stavenum=0;stavenum<this.num_staves;stavenum++) {
            for (let linenum=0;linenum<4;linenum++) {
                stave_y = stavenum*STAVEWIDTH+linenum*STAVELINEWIDTH+this.offset;
                if (y <= stave_y) {
                    if (y <= (stave_y-2*STAVELINEWIDTH)) {
                        return { x:null, y:null, name:null};
                    }
                    if (y <= (stave_y-STAVELINEWIDTH)) {
                        position.y = stave_y-STAVELINEWIDTH;
                        position.name = 'A';
                        break stavebreak;
                    } else if (y <= (stave_y-STAVELINEWIDTH/2)) {
                        position.y = stave_y-STAVELINEWIDTH/2;
                        position.name = this.getNoteFromLine(linenum, true);
                        break stavebreak;
                    } else {
                        position.y = stave_y;
                        position.name = this.getNoteFromLine(linenum);
                        break stavebreak;
                    }
                }
            }
            if ((y <= stave_y+STAVEWIDTH/3)) {
                position.y = stave_y;
                position.name = 'g';
                break stavebreak;
            }
        }
        position.x = x%(width);
        position.y += Math.floor(x/width)*STAVEWIDTH;
        return position;
    }
    getActualCoordFromCanvasCoord(x,y) {
        const snapped_coords = this.getSnappedCoordFromCanvasCoord(x,y);
        if (!(['f','A','G'].includes(snapped_coords.name))) {
            x += (Math.floor(y/STAVEWIDTH)-1)*width;
            y = y%STAVEWIDTH+this.offset;
        // 2*STAVEWIDTH/3 because of high A mouse margin thing (see line 49)
        } else if (Math.floor((y+2*STAVEWIDTH/3)/STAVEWIDTH) != 0) {
            x += (Math.floor((y+2*STAVEWIDTH/3)/STAVEWIDTH)-1)*width;
            y = y%STAVEWIDTH+this.offset-STAVEWIDTH;

            // Dealing with f
            if (y === 0) y+= STAVEWIDTH;
        }
        return [x,y];
    }
    getCoordFromNoteName(name,stavenum) {
        let y = this.offset;
        if (stavenum != null) y += stavenum * STAVEWIDTH;
        switch(name) {
            case 'A':
                return (y-STAVELINEWIDTH);
            case 'G':
                return (y-STAVELINEWIDTH/2);
            case 'f':
                return (y);
            case 'e':
                return (y+STAVELINEWIDTH/2);
            case 'd':
                return (y+STAVELINEWIDTH);
            case 'c':
                return (y+1.5*STAVELINEWIDTH);
            case 'b':
                return (y+2*STAVELINEWIDTH);
            case 'a':
                return (y+2.5*STAVELINEWIDTH);
            default:
                return (y+3*STAVELINEWIDTH);
        }
    }
    addStave() {
        ++this.num_staves;
    }
    removeStave() {
        --this.num_staves;
    }
}
