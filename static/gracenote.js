class Gracenote {
	constructor() {
		this.notes = [];
		this.stem_height = 20;
	}
	addNote(snapToLine,x,y) {
		const snapped = snapToLine(y);
		if (snapped != null) {
			const note = {
				x: x,
				y: snapped[0],
				actual_y: snapped[0],
				name: snapped[1],
				selected: false,
			}
			this.notes.push(note);
		}
	}
	draw(snapToLine) {
		strokeWeight(0);
		this.notes = this.notes.sort((a,b) => (a.x > b.x)? 1 : -1);
		let stem_y;
		if (this.notes[0]) stem_y = this.highestNoteY-this.stem_height;
		this.notes.forEach(note => {
			note.selected ? fill(SELECTED_COLOUR) : fill(BLACK);
			note.y = (snapToLine(note.actual_y) != null) ? snapToLine(note.actual_y)[0] : note.y;
			note.name = (snapToLine(note.actual_y) != null) ? snapToLine(note.actual_y)[1] : note.name;
			
			stroke(WHITE);
			ellipse(note.x,note.y,7,5);
			stroke(BLACK);
			strokeWeight(1.5);
			line(note.x+3.5,note.y,note.x+3.5,stem_y);
			if (note.name === 'A') {
				line(note.x-4.5,note.y,note.x+4.5,note.y);
			}
		});
		if (this.notes.length > 1)	{
			line(this.notes[0].x+4.5,stem_y,this.notes[this.notes.length-1].x+4.5,stem_y);
			line(this.notes[0].x+4.5,stem_y+3,this.notes[this.notes.length-1].x+4.5,stem_y+3);
			line(this.notes[0].x+4.5,stem_y+6,this.notes[this.notes.length-1].x+4.5,stem_y+6);
		} else if (this.notes.length === 1) {	
			const note = this.notes[0];
			line(note.x+4.5,stem_y,note.x+7,stem_y+2);
			line(note.x+4.5,stem_y+3,note.x+7,stem_y+5);
			line(note.x+4.5,stem_y+6,note.x+7,stem_y+8);
		}
	}
	get highestNoteY() {
		let highest_note_y = Infinity;
		this.notes.forEach(note => {
			if (note.y < highest_note_y) highest_note_y=note.y;
		})
		return highest_note_y;
	}
	checkIfSelected() {
		for (const n of this.notes) {
			if (((n.x-CLICK_MARGIN) < mouseX) && ((n.x+CLICK_MARGIN) > mouseX) && ((n.y-CLICK_MARGIN) < mouseY) && ((n.y+CLICK_MARGIN)>mouseY)) {
				n.selected = true;
				return true;
			}
		}
		return false;
	}
	dragSelected(dx,dy) {
		this.notes.forEach(n => {
			if (n.selected) {
				n.x += dx;
				n.actual_y += dy;
			}
		});
	}
	deselect() {
		this.notes.forEach(note => {
			note.selected = false;
		});
	}
	checkIfNotesOutwithBoundary(notes, parent_note, snapToLine) {
		// unfinished
		const notes_to_move = [];
		for (const prevNote of notes) {
			if (JSON.stringify(parent_note) != JSON.stringify(prevNote)) {
				this.notes.forEach(note => {
					if (note.x < (prevNote.x-prevNote.width)) {
						notes_to_move.push([prevNote,note]);
					}
				});
			}
		};
		if (notes_to_move.length === 0) return false;
		
		notes_to_move.forEach(note_and_gracenote => {
			const note = note_and_gracenote[0];
			const gracenote = note_and_gracenote[1]; 
			
			note.gracenote.addNote(snapToLine,gracenote.x,gracenote.y);
			note.gracenote.checkIfSelected();
			this.notes.splice(this.notes.indexOf(note),1);
		});
		return true;
	}
}