class Text {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.text = "Hello, World!";
        this.font_size = 16;
        this.margin = 5;
        this.selected = false;
    }
    draw() {
        textAlign(LEFT,TOP);
        textSize(this.font_size);
        strokeWeight(0);
        fill(0);
        text(this.text,this.x,this.y);
        stroke(SELECTED_COLOUR);
        this.selected ? strokeWeight(2) : strokeWeight(0);
        fill(0,0,0,0);
        rect(this.x-this.margin,this.y-this.margin,this.width+this.margin*2,this.height+this.margin*2);
    }
    checkIfSelected(x,y) {
        return ((x > this.x) && (x < (this.x+this.width)) && (y > this.y) && (y < (this.y+this.height)));
    }
    get width() {
        return this.font_size * this.text.length/2;
    }
    get height() {
        return this.font_size;
    }
    drag(dx,dy) {
        this.x += dx;
        this.y += dy;
    }
}