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

function preload() {
	time_sig_font = loadFont('static/fonts/AbrilFatface-Regular.ttf');
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