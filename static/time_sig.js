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
        } else {
            this.numerator = parseInt(document.querySelector('#timesig-num').value);
            this.denominator = parseInt(document.querySelector('#timesig-den').value);
        }
        (this.selected) ? fill(SELECTED_COLOUR) : fill(0);
        const num_text = `${this.numerator}`;
        const den_text = `${this.denominator}`;
        strokeWeight(0);
        textAlign(CENTER);
        textStyle(NORMAL);
        textSize(28);
        textFont(time_sig_font);
        const shove = 7;
        text(num_text,x,y-shove);
        text(den_text,x,y+26-shove);

        textFont('Montserrat');
    }
    select() {
        this.selected = true;
        document.querySelector('#timesig-num').value = this.numerator;
        document.querySelector('#timesig-den').value = this.denominator;
    }
}
