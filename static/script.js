let score;

function setup() {
	const cnv = createCanvas(210*4,297*4);
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
window.addEventListener('error', e => {
	const error_div = document.querySelector('#error');
	error_div.innerHTML = `<p>Uh-oh, we encountered the following error:<br>
<code>${e.message}</code></p>`;
	error_div.style.display = 'block';
})