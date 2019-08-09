class Stave {
    constructor() {
        this.offset = STAVEWIDTH;
        this.getCoordFromNoteName = this.getCoordFromNoteName.bind(this);
    }
    draw() {
        stroke(0);
        strokeWeight(2);
        image(trebleClef,MARGIN-5,this.offset,50,64);
        for (let linenum=0;linenum<5;linenum++) {
            const y = linenum*STAVELINEWIDTH+this.offset;
            line(MARGIN,y,width-MARGIN,y);
        }
    }
    getNoteFromLine(line, inbetween=false) {
        const notes = ['g','a','b','c','d','e','f','G','A']
		let thenote = (-2*line)+6;
        if (inbetween) thenote += 1;
        return notes[thenote];
    }
    snapToLine(y,x) {
        if (y < 0) return {x:null,y:null,name:null};

        const position = {x:null,y:null,name:null};

        let stave_y;
        for (let linenum=0;linenum<4;linenum++) {
            stave_y = linenum*STAVELINEWIDTH+this.offset;
            if (y <= stave_y) {
                if (y <= (stave_y-STAVELINEWIDTH)) {
                    position.y = stave_y-STAVELINEWIDTH;
                    position.name = 'A';
                    break;
                } else if (y <= (stave_y-STAVELINEWIDTH/2)) {
                    position.y = stave_y-STAVELINEWIDTH/2;
                    position.name = this.getNoteFromLine(linenum, true);
                    break;
                } else {
                    position.y = stave_y;
                    position.name = this.getNoteFromLine(linenum);
                    break;
                }
            }
        }
        if ((position.y == null) && (y <= stave_y+STAVEWIDTH/3)) {
            position.y = stave_y;
            position.name = 'g';
        }
        return position;
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
