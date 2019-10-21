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
let created_database = false;

function preload() {
	time_sig_font = loadFont('/res/fonts/AbrilFatface-Regular.ttf');
	trebleClef = loadImage('/res/images/trebleClef.png');     // 375 x 640
	note_tail = loadImage('/res/images/noteTail.png');          // 72 x 155
	blue_note_tail = loadImage('/res/images/blueNoteTail.png');
}

falsePromise = () => {
	return new Promise((res,_) => res(false));
}

function loadScore(score) {
	// returns false if new score needed

	let path = window.location.pathname;

	if (path.endsWith('/')) path = path.slice(0,path.length-1);
	if (path === '/pipescore') return new Promise((res,_) => res(true));
	if (!path.startsWith('/score/')) {
		return falsePromise();
	}
	path = path.replace('/score/','');
	path = path.split('/');
	if (path.length !== 2) {
		return falsePromise();
	}
	const author = path[0];
	const score_id = path[1];

	openDatabaseEntry(score_id);
	return new Promise((res,rej) => {
		retrieveFromDatabase(author)
		.then(data => {
			if (data) res(data);
			else res(false);
		})
		.catch(e => rej(e));
	});
}

function setup() {
	const cnv = createCanvas(210*4,297*4);
	cnv.parent('page');
	const pdf = createPDF();
	pdf.beginRecord();
	score = new Score();
	cnv.mousePressed(mousePress);
	mouseReleased = mouseRelease;
	loadScore(score)
	.then(s => {
		if (s === false) window.location = '/pipescore';
		else if (s !== true) score = Score.fromJSON(s)

		document.getElementById('loading').style.display = 'none';
	});
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

function loadFromDB() {
	retrieveFromDatabase()
	.then(data => {
		score = Score.fromJSON(data);
	});
}

function keyPressed(e) {
	if (keyCode === 83 && keyIsDown(17)) {
		e.preventDefault();
		if (!created_database) {
			createNewDatabaseEntry(score.toJSON());
			created_database = true;
		} else {
			saveToDatabase(score.toJSON())
		}
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