class Barline {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    draw() {
        stroke(0);
        strokeWeight(2);
        line(this.x,this.y,this.x,this.y+4*STAVELINEWIDTH);
    }
}