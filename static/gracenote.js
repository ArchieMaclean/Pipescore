class Gracenote {
	constructor() {
		this.notes = [];
		this.stem_height = 20;
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
	draw() {
		fill(BLACK);
		this.notes = this.notes.sort((a,b)=>(a.x>b.x)?1:-1);	// order
		let stem_y;
		if (this.notes[0]) stem_y = this.highestNoteY-this.stem_height;
		this.notes.forEach(note => {
			stroke(WHITE);
			ellipse(note.x,note.y,9,7);
			stroke(BLACK);
			line(note.x+4.5,note.y,note.x+4.5,stem_y);
			if (note.name === 'A') {
				strokeWeight(2);
				line(note.x-6,note.y,note.x+6,note.y);
			}
		});
		if (this.notes[0])	{
			line(this.notes[0].x+4.5,stem_y,this.notes[this.notes.length-1].x+4.5,stem_y);
			line(this.notes[0].x+4.5,stem_y+3,this.notes[this.notes.length-1].x+4.5,stem_y+3);
			line(this.notes[0].x+4.5,stem_y+6,this.notes[this.notes.length-1].x+4.5,stem_y+6);
		}
	}
	get highestNoteY() {
		let highest_note_y = Infinity;
		this.notes.forEach(note => {
			if (note.y < highest_note_y) highest_note_y=note.y;
		})
		return highest_note_y;
	}
}