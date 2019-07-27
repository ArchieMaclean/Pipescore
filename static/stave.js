class Stave {
    constructor(offset) {
        this.offset = offset*STAVEWIDTH;
    }
    draw() {
        stroke(0);
        strokeWeight(2);
        image(trebleClef,MARGIN-5,this.offset,50,64);
        for (var linenum=0;linenum<5;linenum++) {
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
    snapToLine(y) {
        if (y < 0) return null;
        for (var linenum=0;linenum<4;linenum++) {
            // var because scoping issues with return if const (end of method return)
            var stave_y = linenum*STAVELINEWIDTH+this.offset;
            if (y <= stave_y) {
                if (y <= (stave_y-STAVELINEWIDTH)) {
                    return [stave_y-STAVELINEWIDTH,'A']
                } else if (y <= (stave_y-STAVELINEWIDTH/2)) {
                    return [stave_y-STAVELINEWIDTH/2,this.getNoteFromLine(linenum, true)]
                } else {
                    return [stave_y,this.getNoteFromLine(linenum)]
                }
            }
        }
        if (y <= stave_y+STAVEWIDTH/3)  return [stave_y, 'g'];
        return null;
    }
}
