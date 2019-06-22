class Gracenote {
	constructor() {
		this.notes = [];
	}
	addNote(stave,x,y) {
		const snapped = stave.snapToLine(y);
		const note = {
			x: x,
			y: snapped[0],
			name: snapped[1]
		}
		this.notes.push(note);
	}
	drawNotes() {
		fill(BLACK);
		this.notes.forEach(note=>{
			stroke(WHITE);
			ellipse(note.x,note.y,9,7);
			if (note.name==='A') {
				stroke(BLACK);
				strokeWeight(2);
				line(note.x-6,note.y,note.x+6,note.y);
			}
		});
	}
}
