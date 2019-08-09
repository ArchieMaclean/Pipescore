let score;

function setup() {
	const cnv = createCanvas(210*5,297*5);
	cnv.parent('page');
	cnv.mousePressed(mousePress);
	const pdf = createPDF();
	pdf.beginRecord();
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
