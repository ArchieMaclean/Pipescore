class Text {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.text = "Hello, World!";
        this.fontName = 'Lobster';
        this.font = 'https://fonts.googleapis.com/css?family=Lobster&display=swap';
        this.font_size = 16;
        this.margin = 5;
        this.setupFont();
    }
    draw() {
        textAlign(LEFT,TOP);
        textSize(this.font_size);
        strokeWeight(0);
        fill(0);
        text(this.text,this.x,this.y);
        stroke(0);
        strokeWeight(2);
        fill(0,0,0,0);
        rect(this.x-this.margin,this.y-this.margin,this.width+this.margin*2,this.height+this.margin*2);
    }
    setupFont() {
        const el = document.createElement('style');
        el.innerHTML = `@import url('${this.font}');`
        document.body.appendChild(el);
        textFont(this.fontName);
    }
    get width() {
        return this.font_size * this.text.length/2;
    }
    get height() {
        return this.font_size;
    }
}