
let score;
function setup() {
	score = new Score();
}

function draw() {
	score.draw();
}

function mousePress() {
	score.mousePress();
}

function mouseReleased() {
	score.mouseReleased();
}

function keyPressed() {
	score.keyPressed();
}

function mouseDragged() {
	score.mouseDragged();
}
