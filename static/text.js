class Text {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.text = "-no text-";
        this.font_size = 16;
        this.width = 200;
        this.height = 20;
        this.selected = false;
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
            console.log(this.width,this.height);
            if (this.checkIfSelected(mouseX,mouseY)) document.getElementById('programmable-styles').innerHTML += '* {cursor:grab}';

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
            this.width = parseInt(document.querySelector('#textbox-width').value);
            this.height = parseInt(document.querySelector('#textbox-height').value);
        }
    }
    select() {
        this.selected = true;
        const textarea = document.querySelector('#textarea');
        textarea.value = this.text;
        textarea.disabled = false;
        textarea.placeholder = 'Textbox text here...';
        document.querySelector('#textbox-width').value = this.width;
        document.querySelector('#textbox-height').value = this.height;
    }
    deselect() {
        this.selected = false;
        if (this.text === '') {
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