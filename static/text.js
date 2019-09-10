class Text {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.text = "Title";
        this.font_size = 16;
        this.width = 200;
        this.height = 16;
        this.selected = false;
    }
    draw() {
        this.update();
        textAlign(CENTER,TOP);
        textSize(this.font_size);
        strokeWeight(0);
        fill(this.selected ? SELECTED_COLOUR : 0);
        text(this.text,this.x,this.y,this.width,this.height);
        if (this.selected && this.checkIfSelected(mouseX,mouseY)) {
            document.getElementById('programmable-styles').innerHTML += '* {cursor:grab}'
            fill(0,0,0,0);
            stroke(SELECTED_COLOUR);
            strokeWeight(3);
            rect(this.x-5,this.y-5,this.width+10,this.height+10);
        }
    }
    checkIfSelected(x,y) {
        return ((x > this.x) && (x < (this.x+this.width)) && (y > this.y) && (y < (this.y+this.height)));
    }
    update() {
        if (this.selected) {
            this.text = document.querySelector('#textarea').value;
        }
    }
    select() {
        this.selected = true;
        document.querySelector('#textarea').value = this.text;
    }
    drag(dx,dy) {
        this.x += dx;
        this.y += dy;
    }
}