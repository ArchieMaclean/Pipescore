class Stave {
    constructor(num_staves=1) {
        this.num_staves = num_staves;
    }

    draw() {
        stroke(0);
        strokeWeight(2);
		for (var stavenum=1;stavenum<=this.num_staves;stavenum++) {
            image(trebleClef,MARGIN-5,stavenum*STAVEWIDTH,50,64);
            for (var linenum=0;linenum<5;linenum++) {
                var y = linenum*STAVELINEWIDTH+stavenum*STAVEWIDTH;
                line(MARGIN,y,width-MARGIN,y);
            }
        }
    }

    getNoteFromLine(line, inbetween=false) {
        var notes = ["g","a","b","c","d","e","f","G","A"]
		var thenote = (-2*line)+6;
        if (inbetween) {
            thenote+=1;
        }

        return notes[thenote];
    }

    snapToLine(y) {
        for (var stavenum=1;stavenum<=this.num_staves;stavenum++) {
            for (var linenum=0;linenum<4;linenum++) {
                var stave_y = linenum*STAVELINEWIDTH+stavenum*STAVEWIDTH;
                if (y<=stave_y && y>0) {
					if ((linenum==0)&&(stavenum!=1)) {
						if (y<(stave_y-(STAVEWIDTH/3))) {
							return [3*STAVELINEWIDTH+(stavenum-1)*STAVEWIDTH, "g"];
						} else {
							return [stave_y-STAVELINEWIDTH, "A"];
						}
					}
                    if (y<=stave_y-STAVELINEWIDTH) {
                        return [stave_y-STAVELINEWIDTH,"A"]
                    } else if (y<=stave_y-STAVELINEWIDTH/2) {
                        return [stave_y-STAVELINEWIDTH/2,this.getNoteFromLine(linenum, true)]
                    } else {
                        return [stave_y,this.getNoteFromLine(linenum)]
                    }
                } else if (y<=0) {
                    return null
                }
            }
        }
        return [stave_y, "g"];
    }
}
