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
		background(255);
		strokeCap(SQUARE);
		trebleClef = loadImage('/images/trebleClef.png');     // 375 x 640
		note_tail = loadImage('/images/noteTail.png');          // 72 x 155
		blue_note_tail = loadImage('/images/blueNoteTail.png');
		this.stave = new Stave();
		this.demo_note = new DemoNote();
		
		
		document.getElementById('dot-notes-button').addEventListener('click',() => this.dotSelectedNotes());
		document.getElementById('group-notes-button').addEventListener('click',_ => this.groupSelectedNotes());
		document.getElementById('ungroup-notes-button').addEventListener('click',_ => this.ungroupSelectedNotes());
		document.getElementById('delete-notes-button').addEventListener('click',_ => this.deleteSelectedNotes());

		this.mode = 'create';
		this.note_mode = 'crotchet';
		this.menu_mode = 'note';
		this.notes = [];
		this.gracenotes = [];
		this.mouse_dragged_displacement = [0,0];
		this.mouse_last_x_y = [0,0];
		this.mouse_original_x_y = [0,0];

		this.snapNoteToLine = this.snapNoteToLine.bind(this);
	}
	draw() {
		background(255);
		this.updateNoteMode();
		this.stave.draw();
		this.updateDemoNote();
		this.drawNotes();
		if (this.mouse_dragged) this.mouseDraggedUpdate();
	}
	noteModeChanged() {
		this.note_mode = $('input[name=note]:checked').val();
		this.changeSelectedNoteNames();
	}
	updateNoteMode() {
		const old_menu_mode = this.menu_mode;
		this.menu_mode = document.querySelector('#menu-titles .viewing').id.replace('-title','');
		if (old_menu_mode != this.menu_mode) {
			this.deselectAllNotes();
			this.deselectAllGracenotes();
		}
		this.mode = $(`#mode-${this.menu_mode}`).val();
		if (this.mode != 'select') {
			this.deselectAllNotes();
		}
	}
	updateDemoNote() {
		if (this.mode === 'create') {
			this.demo_note.update(this.snapNoteToLine,this.menu_mode,this.stave.getCoordFromNoteName);
			this.demo_note.draw(this.menu_mode);
		}
	}
	snapNoteToLine(x,y) {
		return this.stave.getSnappedCoordFromCanvasCoord(x,y);
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
		this.notes.forEach(note => {
			note.draw(this.snapNoteToLine);
		});
		this.gracenoteGroups.forEach(group => {
			group.forEach(note => note.draw(this.snapNoteToLine,group.slice()));
		});
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
		const notes = this.sortedNotes;
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
		if (this.menu_mode === 'note') {
			this.notes.forEach(note => {
				if ((note.x > left) && (note.x < right) && (note.y > top) && (note.y < bottom)) note.selected=true;
			});
		} else if (this.menu_mode === 'gracenote') {
			this.gracenotes.forEach(note => {
				if ((note.x > left) && (note.x < right) && (note.y > top) && (note.y < bottom)) note.selected=true;
			});
		}
	}
	getSelectedNote() {
		for (const note of this.notes) {
			if (note.checkIfSelected(mouseX,mouseY)) return note;
		}
	}
	getSelectedGracenote() {
		for (const note of this.gracenotes) {
			if (note.checkIfSelected()) return note
		}
	}
	deselectAllNotes() {
		this.selectedNotes.forEach(note => {
			note.deselect();
		});
		this.box_select = false;
	}
	deselectAllGracenotes() {
		this.gracenotes.forEach(note => {
			note.deselect();
		});
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
							const {x,y,name} = this.snapNoteToLine(mouseX,mouseY);
							const dotted = document.getElementById('dot-notes-button').checked
							if (y != null) {
								this.notes.push(new Note(x,y,name,this.note_mode,dotted,this.stave.getActualCoordFromCanvasCoord));
							}
						}
					}
				} else if (this.menu_mode === 'gracenote') {
					const selected_note = this.getSelectedNote();
					if (selected_note == null) {
						const x = mouseX;
						if ((x > 0) && (x < width)) {
							const {x,y,name} = this.snapNoteToLine(mouseX,mouseY);
							if (y != null) {
								this.gracenotes.push(new Gracenote(x,y,name,this.stave.getActualCoordFromCanvasCoord));
							}
						}
					}
				}
			} else if (this.mode === 'select') {
				this.mouse_original_x_y = [mouseX,mouseY];
				this.mouse_last_x_y = [mouseX,mouseY];
				this.mouse_dragged_displacement = [0,0];
				const selected_note = this.getSelectedNote();
				const selected_gracenote = this.getSelectedGracenote();
				if ((this.menu_mode === 'note') && (selected_note != null)) {
					selected_note.selected = true;
				} else if ((this.menu_mode === 'gracenote') && (selected_gracenote != null)) {
					selected_gracenote.selected = true;
				} else {
					this.deselectAllNotes();
					this.deselectAllGracenotes();
					this.box_select = true;
				}
			}
		} else if (mouseButton === CENTER) {
			pdf.save();
		}
	}
	mouseReleased() {
		for (const note of this.selectedNotes) {
			note.resetActualY(this.snapNoteToLine);	// so that when dragging again, note starts at right place
		}
		this.mouse_dragged = false;
		this.box_select = false;
	}
	get selectedNotes() {
		const selected = [];
		for (const note of this.sortedNotes) {
			if (note.selected) {
				selected.push(note);
			}
		}
		return selected;
	}
	get selectedGracenotes() {
		const selected = [];
		for (const note of this.gracenotes) {
			if (note.selected) {
				selected.push(note);
			}
		}
		return selected;
	}
	get sortedNotes() {
		return this.notes.sort((a,b) => (a.actual_x > b.actual_x) ? 1 : -1);
	}
	get gracenoteGroups() {
		const groups = new Array();

		// can't do .fill() because of referencing arrays
		for (let i = 0;i < (this.notes.length+1); i++) groups[i] = new Array();

		const gracenotes = this.gracenotes.slice();
		for (let note = 0; note<this.notes.length; note++) {
			const gracenotes_to_add = [];
			gracenotes.forEach(gracenote => {
				if (gracenote.actual_x < this.sortedNotes[note].actual_x) {
					if (note === 0) {
						gracenotes_to_add.push(gracenote);
					} else if (gracenote.actual_x > this.sortedNotes[note-1].actual_x) {
						gracenotes_to_add.push(gracenote);
					}
				}
			});
			for (const n of gracenotes_to_add) {
				groups[note].push(n);
				gracenotes.splice(gracenotes.indexOf(n),1);
			}
		}
		for (const gracenote of gracenotes) groups[groups.length-1].push(gracenote);
		return groups;
	}
	keyPressed() {
		if (keyCode === ESCAPE) {
			if (this.mode === 'create') {
				$(`#mode-${this.menu_mode}`).val('select');
			} else if (this.mode === 'select') {
				$(`#mode-${this.menu_mode}`).val('create');
			}
		} else if (keyCode === 71) {	// g - group
			if (this.mode === "select") {
				this.groupSelectedNotes();
			}
		} else if (keyCode === 85) { // u - ungroup
			if (this.mode === 'select') {
				this.ungroupSelectedNotes();
			}
		} else if (keyCode === 68) { // d - dot
			if (this.mode ==='select') {
				this.dotSelectedNotes();
			}
		} else if (keyCode === 46) {	// delete
			this.deleteSelectedNotes();
		} else if (keyCode === 78) {	// n - switch to note menu
			document.querySelectorAll('.menu-title').forEach(l => l.classList.remove('viewing'));
			document.querySelector('#note-title').classList.add('viewing');
		}
	}
	mouseDraggedUpdate() {
		if (this.mode=='select') {
			if (mouseButton === LEFT) {
				if (this.box_select) this.boxSelect();
				else if ((this.selectedNotes.length > 0) || (this.selectedGracenotes.length > 0)) {
					this.mouse_dragged_displacement = [0,0]
					if (mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height) {
						this.mouse_dragged_displacement[0] += mouseX-this.mouse_last_x_y[0];
						this.mouse_dragged_displacement[1] += mouseY-this.mouse_last_x_y[1];
					}
					this.selectedNotes.forEach(note => {
						note.drag(...this.mouse_dragged_displacement,this.stave.getActualCoordFromCanvasCoord)
					});
					this.selectedGracenotes.forEach(note => {
						note.drag(...this.mouse_dragged_displacement,this.stave.getActualCoordFromCanvasCoord);
					});
					this.mouse_last_x_y = [mouseX,mouseY];
					this.mouse_dragged_displacement = [0,0];
					
					// grouped notes
					const selected_notes = this.selectedNotes;
					selected_notes.forEach(note => {
						if ((note.connected_before != null) && (note.actual_x < note.connected_before.actual_x)) {
							const first_note = note.connected_before.connected_before;
							note.connected_before.connected_before = note;
							note.connected_before.connected_after = note.connected_after;
							if (note.connected_after != null) note.connected_after.connected_before = note.connected_before;
							note.connected_after = note.connected_before
							note.connected_before = first_note;
							if (first_note != null) first_note.connected_after = note;
						} else if ((note.connected_after != null) && (note.actual_x > note.connected_after.actual_x)) {
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
		const dotted = ! document.getElementById('dot-notes-button').checked;
		this.selectedNotes.forEach(n => n.dotted =! dotted);
	}
	groupSelectedNotes() {
		const selected_notes = this.selectedNotes;
		for (let note_ind=1;note_ind<selected_notes.length;note_ind++) {
			selected_notes[note_ind].addConnected(selected_notes[note_ind-1]);
			selected_notes[note_ind-1].addConnected(selected_notes[note_ind]);
		}
	}
	ungroupSelectedNotes() {
		this.selectedNotes.forEach(note=>{
			note.unConnect();
		});
	}
}
