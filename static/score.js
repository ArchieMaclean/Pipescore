const STAVEWIDTH = 150;
const STAVELINEWIDTH = 13;
const MARGIN = 30;
const SELECTED_COLOUR = [0,0,200];
const CLICK_MARGIN = 5;
const BLACK = 0;
const WHITE = [0,0,0,0];

let trebleClef,note_tail,blue_note_tail;	// images

class Score {
	constructor() {
		this.cnv = createCanvas(210*5,297*5);
		this.cnv.parent('page')
		background(255);
		this.cnv.mousePressed(mousePress);
		trebleClef = loadImage('/images/trebleClef.png');     // 375 x 640
		note_tail = loadImage('/images/noteTail.png');          // 72 x 155
		blue_note_tail = loadImage('/images/blueNoteTail.png');
		this.stave = [new Stave(1), new Stave(2)];
		this.demo_note = new DemoNote();
		this.pdf = createPDF();
		this.pdf.beginRecord();
		
		document.getElementById('dot-notes-button').addEventListener('click',() => this.dotSelectedNotes());

		this.mode = 'create';
		this.note_mode = 'crotchet';
		this.menu_mode = 'note';
		this.notes = [];
		this.mouse_dragged_displacement = [0,0];
		this.mouse_last_x_y = [0,0];
		this.mouse_original_x_y = [0,0];
		this.grace_note_selected = null;

		this.snapNoteToLine = this.snapNoteToLine.bind(this);
	}
	draw() {
		background(255);
		this.update_note_mode();
		this.stave.forEach(stave => stave.draw());
		this.update_demo_note();
		this.drawNotes();
		if (this.mouse_dragged) this.mouseDraggedUpdate();
	}
	noteModeChanged() {
		this.note_mode = $('input[name=note]:checked', '#note_mode').val();
		this.changeSelectedNoteNames();
	}
	update_note_mode() {
		this.note_mode = $('input[name=note]:checked', '#note_mode').val();
		this.mode = $('#mode').val();
		this.menu_mode = document.querySelector('#menu-titles .viewing').id.replace('-title','');
		if (this.mode != 'select') {
			this.deselectAllNotes();
		}
	}
	update_demo_note() {
		if (this.mode === 'create') {
			this.demo_note.update(this.snapNoteToLine,this.menu_mode);
			this.demo_note.draw();
		}
	}
	snapNoteToLine(y) {
		for (const stave of this.stave) {
			if (stave.snapToLine(y) != null) {
				return stave.snapToLine(y);
			}
		}
	}
	changeSelectedNoteNames() {
		this.selectedNotes.forEach(note => {
			note.type = this.note_mode;
			if (['semibreve','minim','crotchet'].indexOf(this.note_mode) != -1) {
				note.unConnect();
			}
		});
	}
	drawNotes() {
		this.equaliseNoteStemHeights();
		for (const note of this.notes) {
			note.draw(this.snapNoteToLine);
		}
	}
	equaliseNoteStemHeights() {
		this.getNoteGroupChains().forEach(chain=>{
			const lowest = this.getLowestNoteOfGroup(chain)+50;
			chain.forEach(n => {
				n.stem_height = lowest-n.y;
			});
		});
	}
	getNoteGroupChains() {
		const notes = this.notes.sort((a,b) => (a.x > b.x) ? 1 : -1);
		const chains = [];
		for (const note of notes) {
			if (note.connected_after && !note.connected_before) {
				chains.push([note]);
			} else if ((note.connected_before != null) && (chains.length != 0)) {
				chains[chains.length-1].push(note);
			}
		}
		return chains
	}
	getLowestNoteOfGroup(group) {
		let lowest = -Infinity;
		group.forEach(n => {
			if (n.y>lowest) lowest = n.y;
		});
		return lowest;
	}
	boxSelect() {		
		fill(50,50,150,150);
		strokeWeight(0);
		const x = this.mouse_original_x_y[0];
		const y = this.mouse_original_x_y[1]
		rect(x,y,mouseX-x,mouseY-y);
		const left = Math.min(x,mouseX);
		const right = Math.max(x,mouseX);
		const top = Math.min(y,mouseY);
		const bottom = Math.max(y,mouseY);
		this.notes.forEach(note => {
			if ((note.x > left) && (note.x < right) && (note.actual_y > top) && (note.actual_y < bottom)) note.selected=true;
		});
	}
	getSelectedNote() {
		for (const note of this.notes) {
			if (note.checkIfSelected(mouseX,mouseY)) {
				return note;
			}
		}
	}
	getSelectedGracenote() {
		for (const note of this.notes) {
			if (note.getSelectedGracenote()) {
				return note;
			}
		}
	}
	deselectAllNotes() {
		for (const note of this.notes) {	// needs to be this.notes to deal with gracenotes
			note.deselect();
		}
		this.grace_note_selected = null;
		this.box_select = false;
	}
	deleteSelectedNotes() {
		this.selectedNotes.forEach(note => {
			this.notes.splice(this.notes.indexOf(note),1)
		});
	}
	mousePress() {
		if (mouseButton === LEFT) {
			if (this.mode === 'create') {
				if (this.menu_mode === 'note') {
					const selected_note = this.getSelectedNote();
					if (selected_note == null) {
						const x = mouseX;
						if ((x > 0) && (x < width)) {
							const snapped = this.snapNoteToLine(mouseY);
							if (snapped != null) {
								const y = snapped[0];
								let note = snapped[1];
							
								note = new Note(this.snapNoteToLine, mouseX,mouseY,this.note_mode);
								this.notes.push(note);
							}
						}
					}
				} else if (this.menu_mode === 'gracenote') {
					const notes = this.notes.sort((a,b) => (a.x > b.x) ? 1 : -1);
					let note_clicked;
					for (const note of notes) {
						if (note.x > mouseX) {
							note_clicked = note;
							break;
						}
					}
					if (note_clicked != null) note_clicked.addGracenote(this.snapNoteToLine,mouseX,mouseY);
				}
			} else if (this.mode === 'select') {
				this.mouse_original_x_y = [mouseX,mouseY];
				this.mouse_last_x_y = [mouseX,mouseY];
				this.mouse_dragged_displacement = [0,0];
				const selected_note = this.getSelectedNote();
				const grace_note = this.getSelectedGracenote();
				if (selected_note != null) {
					selected_note.selected=true;
				} else if (grace_note != null) {
					this.grace_note_selected = grace_note;
				} else {
					this.deselectAllNotes();
					this.box_select = true;
				}
			}
		} else if (mouseButton === CENTER) {
			this.pdf.save();
		}
	}
	mouseReleased() {
		for (const note of this.selectedNotes) {
			note.resetActualY();	// so that when dragging again, note starts at right place
		}
		this.mouse_dragged = false;
		this.box_select = false;
	}
	get selectedNotes() {
		var selected = [];
		for (const note of this.notes) {
			if (note.selected) {
				selected.push(note);
			}
		}
		return selected;
	}
	keyPressed() {
		if (keyCode === ESCAPE) {
			if (this.mode === 'create') {
				$('#mode').val('select');
			} else if (this.mode === 'select') {
				$('#mode').val('create');
			}
		} else if (keyCode === 71) {	// g - group
			if (this.mode === "select") {
				const selected_notes = this.selectedNotes.sort((a,b) => (a.x > b.x) ? 1 : -1);
				for (var note_ind=1;note_ind<selected_notes.length;note_ind++) {
					selected_notes[note_ind].addConnected(selected_notes[note_ind-1]);
					selected_notes[note_ind-1].addConnected(selected_notes[note_ind]);
				}
			}
		} else if (keyCode === 85) { // u - ungroup
			if (this.mode === 'select') {
				this.selectedNotes.forEach(note=>{
					if ((note.connected_before != null) && (note.connected_before.selected)) {
						note.connected_before.connected_after = null;
						note.connected_before = null;
					}
					if ((note.connected_after != null) && (note.connected_after.selected)) {
						note.connected_after.connected_before = null;
						note.connected_after = null;
					}
				});
			}
		} else if (keyCode === 68) { //d
			if (this.mode ==='select') {
				this.dotSelectedNotes();
			}
		} else if (keyCode === 46) {	// delete
			this.deleteSelectedNotes();
		}
	}
	mouseDraggedUpdate() {
		if (this.mode=='select') {
			if (mouseButton === LEFT) {
				if (this.box_select) this.boxSelect();
				else if (this.grace_note_selected != null) {
					this.mouse_dragged_displacement[0] += mouseX-this.mouse_last_x_y[0];
					this.mouse_dragged_displacement[1] += mouseY-this.mouse_last_x_y[1];
					this.grace_note_selected.dragGracenote(...this.mouse_dragged_displacement);
					this.mouse_last_x_y = [mouseX,mouseY];
					this.mouse_dragged_displacement = [0,0];
				} else if (this.selectedNotes.length>0) {
					this.mouse_dragged_displacement[0] += mouseX-this.mouse_last_x_y[0];
					this.mouse_dragged_displacement[1] += mouseY-this.mouse_last_x_y[1];
					for (const note of this.selectedNotes) {
						note.x += this.mouse_dragged_displacement[0];
						note.actual_y += this.mouse_dragged_displacement[1];
						note.gracenote.notes.forEach(n=> {
							n.x += this.mouse_dragged_displacement[0];
						});
					}
					this.mouse_last_x_y = [mouseX,mouseY];
					this.mouse_dragged_displacement = [0,0];
					
					// grouped notes
					const selected_notes = this.selectedNotes.sort((a,b) => (a.x > b.x) ? 1 : -1);
					selected_notes.forEach(note=>{
						if ((note.connected_before != null) && (note.x < note.connected_before.x)) {
							const first_note = note.connected_before.connected_before;
							note.connected_before.connected_before = note;
							note.connected_before.connected_after = note.connected_after;
							if (note.connected_after!=null) note.connected_after.connected_before = note.connected_before;
							note.connected_after = note.connected_before
							note.connected_before = first_note;
							if (first_note!=null) first_note.connected_after = note;
						} else if ((note.connected_after != null) && (note.x > note.connected_after.x)) {
							const final_note = note.connected_after.connected_after;
							note.connected_after.connected_after = note;
							note.connected_after.connected_before = note.connected_before;
							if (note.connected_before != null) note.connected_before.connected_after = note.connected_after;
							note.connected_before = note.connected_after;
							note.connected_after = final_note;
							if (final_note != null) final_note.connected_before = note;
						}
					});
				}
			}
		}
	}
	mouseDragged() {
		this.mouse_dragged = true;
	}
	dotSelectedNotes() {
		this.selectedNotes.forEach(n => n.dotted =! n.dotted);
	}
}
