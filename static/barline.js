class Barline {
    constructor(x,y,stave) {
        this.offset = stave.offset;
        this.stave_width = width-2*MARGIN;

        const actual_coords = this.getActualCoord(x,y);
        this.actual_x = actual_coords[0];
        this.actual_y = actual_coords[1];

        this.x = x;
        this.y = y;
        this.selected = false;
    }
    draw() {
        // For some reason, gracenotes added with button have furry edges
        (this.selected) ? stroke(SELECTED_COLOUR) : stroke(0);
        strokeWeight(2);
        const [x,y] = this.getCanvasCoord(this.actual_x,this.actual_y);
        if (!this.selected) {
            this.x = x;
            this.y = y;
        }
        line(x,y,x,y+4*STAVELINEWIDTH);
    }
    snapToStave(y) {
        return this.offset + Math.floor((y-this.offset)/STAVEWIDTH);
    }
    getActualCoord(x,y) {
        const stave_height = (Math.floor((y-this.offset)/STAVEWIDTH) < 0) ? 0 : Math.floor((y-this.offset)/STAVEWIDTH);
        x += stave_height*width;
        y = 0;
        return [x,y];
    }
    getCanvasCoord(x,y) {
        let new_x = x%width;
        if (new_x > (MARGIN+this.stave_width)) new_x = MARGIN+this.stave_width;
        if (new_x < MARGIN) new_x = MARGIN;
        const new_y = Math.floor(x/width)*STAVEWIDTH+this.offset;
        return [new_x,new_y];
    }
    drag(dx,dy) {
        this.x += dx;
        this.y += dy;
        const actual_coords = this.getActualCoord(this.x,this.y);
        this.actual_x = actual_coords[0];
        this.actual_y = actual_coords[1];
    }
    checkIfSelected(x,y) {
        const margin = 10;
        if ((x > (this.x-margin)) && (x < (this.x+margin)) && (y > this.y) && (y < (this.y+4*STAVELINEWIDTH))) return true;
        return false;
    }
    reset() {
        this.x,this.y = this.getCanvasCoord(this.actual_x,this.actual_y);
    }
    deselect() {
        this.selected = false;
    }
}