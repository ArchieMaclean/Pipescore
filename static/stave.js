class Stave {
    constructor() {
        this.offset = STAVEWIDTH;
        this.getCoordFromNoteName = this.getCoordFromNoteName.bind(this);
        this.num_staves = 3;
        this.getActualCoordFromCanvasCoord = this.getActualCoordFromCanvasCoord.bind(this);
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
    getSnappedCoordFromCanvasCoord(x,y) {
        const position = {x:null,y:null,name:null};
        if (y < 0) return position;
        let stave_y;
        stavebreak:
        for (let stavenum=0;stavenum<this.num_staves;stavenum++) {
            for (let linenum=0;linenum<4;linenum++) {
                stave_y = stavenum*STAVEWIDTH+linenum*STAVELINEWIDTH+this.offset;
                if (y <= stave_y) {
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
        if (!(['f','A','G'].includes(this.getSnappedCoordFromCanvasCoord(x,y).name))) {
            x += (Math.floor(y/STAVEWIDTH)-1)*width;
            y = y%STAVEWIDTH+this.offset;
        // 2*STAVEWIDTH/3 because of high A mouse margin thing (see line 49)
        } else if (Math.floor((y+2*STAVEWIDTH/3)/STAVEWIDTH) != 0) {
            x += (Math.floor((y+2*STAVEWIDTH/3)/STAVEWIDTH)-1)*width;
            y = y%STAVEWIDTH+this.offset-STAVEWIDTH;
        }
        return [x,y];
    }
    getCoordFromNoteName(name) {
        switch(name) {
            case 'A':
                return (this.offset-STAVELINEWIDTH);
            case 'G':
                return (this.offset-STAVELINEWIDTH/2);
            case 'f':
                return (this.offset);
            case 'e':
                return (this.offset+STAVELINEWIDTH/2);
            case 'd':
                return (this.offset+STAVELINEWIDTH);
            case 'c':
                return (this.offset+1.5*STAVELINEWIDTH);
            case 'b':
                return (this.offset+2*STAVELINEWIDTH);
            case 'g':
                return (this.offset+2.5*STAVELINEWIDTH);
            default:
                return (this.offset+3*STAVELINEWIDTH);
        }

    }
}
