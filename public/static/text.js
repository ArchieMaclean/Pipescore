class Text {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.text = "-no text-";
        this.font_size = 16;
        this.selected = false;
    }
    get width() {
        const width_array = this.text.split('\n').map(t => textWidth(t));
        const largest = Math.max(...width_array);
        return largest+5;
    }
    get height() {
        const row_height = this.text.split('\n').length;
        return row_height * (this.font_size+8);
    }
    draw() {
        this.update();
        textAlign(CENTER,TOP);
        strokeWeight(0);
        fill(this.selected ? SELECTED_COLOUR : 0);
        textSize(this.font_size);
        text(this.text,this.x,this.y,this.width,this.height);
        if (this.selected) {
            fill(0,0,0,0);
            stroke(SELECTED_COLOUR);
            strokeWeight(3);
            rect(this.x-5,this.y-5,this.width+10,this.height+10);
            if (this.checkIfSelected(mouseX,mouseY)) document.getElementById('programmable-styles').innerHTML += '* {cursor:grab}';
            document.querySelector('#textarea').focus();

        }
    }
    checkIfSelected(x,y) {
        if ((x > this.x) && (x < (this.x+this.width)) && (y > this.y) && (y < (this.y+this.height))) {
            return true;
        }
    }
    update() {
        if (this.selected) {
            this.text = document.querySelector('#textarea').value;
            this.font_size = parseInt(document.querySelector('#font-size').value);
        }
    }
    select() {
        this.selected = true;
        const textarea = document.querySelector('#textarea');
        textarea.value = this.text;
        textarea.disabled = false;
        textarea.placeholder = 'Textbox text here...';
    }
    deselect() {
        this.selected = false;
        if (/^(\n|\s|\t)*$/.test(this.text)) {
            this.text = '-no text-';
        }
        const textarea = document.querySelector('#textarea');
        textarea.value = '';
        textarea.disabled = true;
        textarea.placeholder = 'Select a textbox...';
    }
    drag(dx,dy) {
        this.x += dx;
        this.y += dy;
    }
}