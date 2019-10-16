// User Interface (menu updates)

const titles = [...document.querySelectorAll(".menu-title")];

titles.forEach(title => {
	title.addEventListener('click',() => {
		const id = title.id.replace('-title','');
		const el = document.getElementById(id);
		titles.forEach(men => men.classList.remove('viewing'));
		[...document.querySelectorAll('.menu')].forEach(men => men.classList.remove('viewing'));
		title.classList.toggle('viewing');
		el.classList.toggle('viewing');
	});
});

// Changing note mode
const note_modes = [...document.getElementsByName('note')];
note_modes.forEach(note_mode => {
	document.getElementById(note_mode.id).addEventListener('change',() => score.noteModeChanged());
});

document.getElementById('gracenote-type').addEventListener('click', _ => document.getElementById('place-gracenote').click());