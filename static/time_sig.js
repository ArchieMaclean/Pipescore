class TimeSignature extends Barline {
    constructor(x,y,stave) {
        super(x,y,stave);
        this.numerator = 4;
        this.denominator = 4;
        this.click_margin = 30;
    }
    draw() {
        const [x,y] = this.getCanvasCoord(this.actual_x,this.actual_y);
        if (!this.selected) {
            this.x = x;
            this.y = y;
        }
        (this.selected) ? fill(SELECTED_COLOUR) : fill(0);
        const num_text = `${this.numerator}`;
        const den_text = `${this.denominator}`;
        strokeWeight(0);
        textAlign(LEFT);
        textStyle(NORMAL);
        textSize(35);
        const shove = 2;
        text(num_text,x,y-shove,100,100);
        text(den_text,x,y+26-shove,100,100);
    }
}
