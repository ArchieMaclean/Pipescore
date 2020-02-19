/*
	UI.js - this file deals with some aspects of the UI such as changing menus, e.t.c.

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

const titles = [...document.querySelectorAll(".menu-title")];

titles.forEach(title => {
	title.addEventListener('click',() => {
		const id = title.id.replace('-title','');
		const el = document.getElementById(id);
		titles.forEach(men => men.classList.remove('viewing'));
		[...document.querySelectorAll('.menu')].forEach(men => men.classList.remove('viewing'));
		title.classList.toggle('viewing');
		el.classList.toggle('viewing');
		score.updateNoteMode();
	});
});

// Changing note mode
const note_modes = [...document.getElementsByName('note')];
note_modes.forEach(note_mode => {
	document.getElementById(note_mode.id).addEventListener('change',() => score.noteModeChanged());
});

document.getElementById('gracenote-type').addEventListener('click', _ => document.getElementById('place-gracenote').click());

document.querySelector('#save>button').addEventListener('click',save);
document.querySelector('#undo>button').addEventListener('click',undo);
document.querySelector('#redo>button').addEventListener('click',redo);
document.getElementById('download-pdf').addEventListener('click',_ => savePDF());
document.getElementById('download').addEventListener('click',_ => download());
document.querySelector('#score-name input').addEventListener('change', _ => score.updateName());
// Using arrow functions means I don't have to score-bind
document.getElementById('dot-notes-button').addEventListener('click',_ => score.dotSelectedNotes());
document.getElementById('group-notes-button').addEventListener('click',_ => score.groupSelectedNotes());
document.getElementById('ungroup-notes-button').addEventListener('click',_ => score.ungroupSelectedNotes());
document.getElementById('delete-notes-button').addEventListener('click',_ => score.deleteSelectedNotes());
document.getElementById('delete-gracenotes-button').addEventListener('click',_ => score.deleteSelectedNotes());
document.getElementById('add-bar-before').addEventListener('click',_ => score.addBarBefore());
document.getElementById('add-bar-after').addEventListener('click',_ => score.addBarAfter());
document.getElementById('delete-bar').addEventListener('click',_ => score.deleteSelectedNotes());
document.getElementById('delete-text').addEventListener('click',_ => score.deleteSelectedNotes());
document.getElementById('add-text').addEventListener('click',_ => score.addText());
document.getElementById('add-stave').addEventListener('click',_ => score.stave.addStave());
document.getElementById('remove-stave').addEventListener('click',_ => score.stave.removeStave());
document.getElementById('delete-time-sig').addEventListener('click',_ => score.deleteSelectedNotes());
document.getElementById('add-time-sig').addEventListener('click',_ => score.addTimeSignature());
document.getElementById('delete-whole-gracenote').addEventListener('click', _ => score.deleteEntireSelectedGracenote());

document.addEventListener('keyup', _ => score.updateHistory());
document.addEventListener('mouseup', _ => score.updateHistory());
