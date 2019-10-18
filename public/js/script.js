/*
	script.js - this file sets up the score class and redirects functions to it.

	Copyright (C) 2019  Archie Maclean

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see https://www.gnu.org/licenses/.
*/


let score, time_sig_font;
let trebleClef,note_tail,blue_note_tail;	// images

function preload() {
	time_sig_font = loadFont('../res/fonts/AbrilFatface-Regular.ttf');
	trebleClef = loadImage('../res/images/trebleClef.png');     // 375 x 640
	note_tail = loadImage('../res/images/noteTail.png');          // 72 x 155
	blue_note_tail = loadImage('../res/images/blueNoteTail.png');
}

function setup() {
	const cnv = createCanvas(210*4,297*4);
	cnv.parent('page');
	const pdf = createPDF();
	pdf.beginRecord();
	score = new Score();
	cnv.mousePressed(mousePress);
	mouseReleased = mouseRelease;
}

function draw() {
	score.draw();
}

function mousePress() {
	score.mousePress();
}

function mouseRelease() {
	score.mouseReleased();
}

function keyPressed() {
	if (keyCode === 83) {
		score = Score.fromJSON(score.toJSON());
	} else {
		score.keyPressed();
	}
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