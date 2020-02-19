/*
    Score class - a class that holds the main logic and information required for PipeScore.

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

const STAVEWIDTH = 100;
const STAVELINEWIDTH = 9;
const MARGIN = 30;
const SELECTED_COLOUR = [0,0,200];
const CLICK_MARGIN = 5;
const BLACK = 0;
const WHITE = [0,0,0,0];


class Score {
	constructor(setup=true) {
		background(255);
		strokeCap(SQUARE);
		// Using arrow functions means I don't have to this-bind
		document.getElementById('dot-notes-button').addEventListener('click',_ => this.dotSelectedNotes());
		document.getElementById('group-notes-button').addEventListener('click',_ => this.groupSelectedNotes());
		document.getElementById('ungroup-notes-button').addEventListener('click',_ => this.ungroupSelectedNotes());
		document.getElementById('delete-notes-button').addEventListener('click',_ => this.deleteSelectedNotes());
		document.getElementById('delete-gracenotes-button').addEventListener('click',_ => this.deleteSelectedNotes());
		document.getElementById('add-bar-before').addEventListener('click',_ => this.addBarBefore());
		document.getElementById('add-bar-after').addEventListener('click',_ => this.addBarAfter());
		document.getElementById('delete-bar').addEventListener('click',_ => this.deleteSelectedNotes());
		document.getElementById('delete-text').addEventListener('click',_ => this.deleteSelectedNotes());
		document.getElementById('add-text').addEventListener('click',_ => this.addText());
		document.getElementById('add-stave').addEventListener('click',_ => this.stave.addStave());
		document.getElementById('remove-stave').addEventListener('click',_ => this.stave.removeStave());
		document.getElementById('delete-time-sig').addEventListener('click',_ => this.deleteSelectedNotes());
		document.getElementById('add-time-sig').addEventListener('click',_ => this.addTimeSignature());
		document.getElementById('delete-whole-gracenote').addEventListener('click', _ => this.deleteEntireSelectedGracenote());

		document.addEventListener('keyup', _ => this.updateHistory());
		document.addEventListener('mouseup', _ => this.updateHistory());

		this.snapNoteToLine = this.snapNoteToLine.bind(this);
		this.mouse_dragged_displacement = [0,0];
		this.mouse_last_x_y = [0,0];
		this.mouse_original_x_y = [0,0];
		this.note_mode = 'crotchet';
		this.menu_mode = 'note';
		this.last_gracenote_group = null;

		if (setup) {
			this.stave = new Stave();
			this.demo_note = new DemoNote();
			this.notes = [];
			this.gracenotes = [];
			this.texts = [new Text(width/2-100,50)];
			this.time_sigs = [new TimeSignature(80,this.stave.offset,this.stave)];
			// Add barlines to top line
			// Last is set to width-1 so it snaps to the end of the top line rather than the start of the second line
			this.barlines = [];
			for (let i=0;i<8;i++) {
				this.barlines.push(new Barline(width/4,this.stave.offset+STAVEWIDTH*i,this.stave));
				this.barlines.push(new Barline(width/2,this.stave.offset+STAVEWIDTH*i,this.stave));
				this.barlines.push(new Barline(width*3/4,this.stave.offset+STAVEWIDTH*i,this.stave));
				this.barlines.push(new Barline(width-1,this.stave.offset+STAVEWIDTH*i,this.stave));
			}
			this.createId();
		}
		this.history = [this.toJSON()];
		this.current_history = 0;
	}
	createId() {
		const rand = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		let id = '';
		for (let i=0;i<20;i++) id+=rand.charAt(Math.floor(Math.random()*rand.length));
		this.id = id;
		this.name = id;
		document.querySelector('#score-name input').value = this.name;
	}
	draw() {
		document.getElementById('programmable-styles').innerHTML = '';
		background(255);
		this.stave.draw();
		this.updateDemoNote();
		this.drawNotes();
		this.drawBarlines();
		this.drawTimeSignatures();
		this.drawText();
		if (this.mouse_dragged) this.mouseDraggedUpdate();
	}
	updateHistory() {
		const next = this.toJSON();
		if (JSON.stringify(next) != JSON.stringify(this.history[this.current_history])) {
			this.history[this.current_history+1] = next;
			this.current_history++;
		}
	}
	updateName() {
		this.name = document.querySelector('#score-name input').value;
	}
	noteModeChanged() {
		this.note_mode = document.querySelector('input[name=note]:checked').value;
		this.changeSelectedNoteNames();
	}
	updateNoteMode() {
		const old_menu_mode = this.menu_mode;
		this.menu_mode = document.querySelector('#menu-titles .viewing').id.replace('-title','');
		if (old_menu_mode != this.menu_mode) {
			this.deselectAllNotes();
			this.deselectAllGracenotes();
		}
	}
	updateDemoNote() {
		if (this.menu_mode === 'note' || this.menu_mode === 'gracenote') {
			this.demo_note.update(this.snapNoteToLine,this.menu_mode,this.box_select,this.getSelectedNote(),this.getSelectedGracenote());
			this.demo_note.draw(this.menu_mode,this.stave.getCoordFromNoteName,this.stave.getStavenum);
		}
	}
	snapNoteToLine(x,y) {
		return this.stave.getSnappedCoordFromCanvasCoord(x,y);
	}
	changeSelectedNoteNames() {
		this.selectedNotes.forEach(note => {
			note.updateType(this.note_mode);
			if (['semibreve','minim','crotchet'].indexOf(this.note_mode) != -1) {
				note.unConnect();
			}
		});
	}
	drawBarlines() {
		this.barlines.forEach(barline => barline.draw());
	}
	drawText() {
		this.texts.forEach(text => text.draw());
	}
	drawTimeSignatures() {
		this.time_sigs.forEach(time_sig => time_sig.draw());
	}
	drawNotes() {
		this.equaliseNoteStemHeights();
		this.notes.forEach(note => {
			note.draw(this.snapNoteToLine);
		});
		if (this.mouse_dragged && this.last_gracenote_group) {
			this.last_gracenote_group.forEach(group => {
				group.forEach(note => note.draw(this.snapNoteToLine,group.slice()));
			});
		} else {
			this.gracenoteGroups.forEach(group => {
				group.forEach(note => note.draw(this.snapNoteToLine,group.slice()));
			});
		}
	}
	equaliseNoteStemHeights() {
		this.getNoteGroupChains().forEach(chain=>{
			const lowest = this.getLowestNoteOfGroup(chain)+40;
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
			if (note.checkIfSelected()) return note;
		}
	}
	getSelectedBarline() {
		for (const bl of this.barlines) {
			if (bl.checkIfSelected(mouseX,mouseY)) return bl;
		}
	}
	getSelectedTimeSignature() {
		for (const ts of this.time_sigs) {
			if (ts.checkIfSelected(mouseX,mouseY)) return ts;
		}
	}
	getSelectedText() {
		for (const text of this.texts) {
			if (text.checkIfSelected(mouseX,mouseY)) return text;
		}
	}
	deselectAllNotes() {
		this.selectedNotes.forEach(note => {
			note.deselect();
		});
		this.box_select = false;
		this.texts.forEach(text => text.selected = false);
	}
	deselectAllGracenotes() {
		this.gracenotes.forEach(note => {
			note.deselect();
		});
		this.box_select = false;
	}
	deselectAllBarlines() {
		this.barlines.forEach(bl => {
			bl.deselect();
		});
		this.box_select = false;
	}
	deselectAllTimeSignatures() {
		this.time_sigs.forEach(ts => ts.deselect());
	}
	deselectAllText() {
		this.texts.forEach(t => t.deselect());
	}
	deleteEntireSelectedGracenote() {
		this.gracenoteGroups.forEach(group => {
			for (const n of this.selectedGracenotes) {
				if (group.indexOf(n) !== -1) {
					group.forEach(n => this.gracenotes.splice(this.gracenotes.indexOf(n),1));
				}
			}
		})
	}
	deleteSelectedNotes() {
		this.selectedNotes.forEach(note => {
			this.notes.splice(this.notes.indexOf(note),1);
		});
		this.selectedGracenotes.forEach(grace => {
			this.gracenotes.splice(this.gracenotes.indexOf(grace),1);
		});
		this.selectedBarlines.forEach(bl => {
			this.barlines.splice(this.barlines.indexOf(bl),1);
		});
		this.selectedTexts.forEach(text => {
			text.deselect();
			this.texts.splice(this.texts.indexOf(text),1);
		});
		this.selectedTimeSignatures.forEach(ts => {
			this.time_sigs.splice(this.time_sigs.indexOf(ts),1);
		});
	}
	addText() {
		this.texts.push(new Text(25+Math.random()*(width-50),Math.random()*25+25))
	}
	addBarBefore() {
		if (this.selectedBarlines.length === 0) return;
		const selected_bar = this.selectedBarlines[0];
		const ordered_bars = this.barlines.sort((a,b) => a.actual_x > b.actual_x ? 1 : -1);
		const index = ordered_bars.indexOf(selected_bar);
		let new_bar;
		if (index === -1) return;
		else if (index != 0) {
			const other_bar = ordered_bars[index-1];
			const actual_x = (selected_bar.actual_x + other_bar.actual_x)/2;
			const x = actual_x%width;
			const y = Math.floor(actual_x/width) * STAVEWIDTH + this.stave.offset;
			new_bar = new Barline(x,y,this.stave);
		} else {
			const actual_x = selected_bar.actual_x - (width-2*MARGIN)/4;
			const x = actual_x%width;
			const y = Math.floor(actual_x/width) * STAVEWIDTH + this.stave.offset;
			new_bar = new Barline(x,y,this.stave);
		}
		this.barlines.push(new_bar);
		this.deselectAllBarlines();
		new_bar.selected = true;
	}
	addBarAfter() {
		if (this.selectedBarlines.length === 0) return;
		const selected_bar = this.selectedBarlines[0];
		const ordered_bars = this.barlines.sort((a,b) => a.actual_x > b.actual_x ? 1 : -1);
		const index = ordered_bars.indexOf(selected_bar);
		let new_bar;
		if (index != ordered_bars.length-1) {
			const other_bar = ordered_bars[index+1];
			const actual_x = (selected_bar.actual_x + other_bar.actual_x)/2;
			const x = actual_x%width;
			const y = Math.floor(actual_x/width) * STAVEWIDTH + this.stave.offset;
			new_bar = new Barline(x,y,this.stave);
		} else {
			const actual_x = selected_bar.actual_x + (width-2*MARGIN)/4;
			const x = actual_x%width;
			const y = Math.floor(actual_x/width) * STAVEWIDTH + this.stave.offset;
			new_bar = new Barline(x,y,this.stave);
		}
		this.barlines.push(new_bar);
		this.deselectAllBarlines();
		new_bar.selected = true;
	}
	addTimeSignature() {
		this.time_sigs.push(new TimeSignature(Math.random()*(width-2*MARGIN)+MARGIN,0,this.stave));
	}
	mousePress() {
		if (mouseButton === LEFT) {
			if (this.demo_note.is_valid) {
				if (this.menu_mode === 'note') {
					const selected_note = this.getSelectedNote();
					if (selected_note == null) {
						const x = mouseX;
						if ((x > 0) && (x < width)) {
							const {x,y,name} = this.snapNoteToLine(mouseX,mouseY);
							const dotted = document.getElementById('dot-notes-button').checked
							if (y != null) {
								this.notes.push(new Note(x,y,name,this.note_mode,dotted,this.stave.getActualCoordFromCanvasCoord));
								this.deselectAllNotes();
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
								if (this.demo_note.standard_gracenote == null) {
									this.gracenotes.push(new Gracenote(x,y,name,this.stave.getActualCoordFromCanvasCoord));
								} else {
									let x = this.demo_note.x;
									this.demo_note.standard_gracenote.forEach(gracenote => {
										this.gracenotes.push(new Gracenote(x,this.stave.getCoordFromNoteName(gracenote,this.stave.getStavenum(this.demo_note.y)),gracenote,this.stave.getActualCoordFromCanvasCoord));
										x += 10;
										this.deselectAllGracenotes();
									});
								}
							}
						}
					}
				}
			} else {
				this.mouse_original_x_y = [mouseX,mouseY];
				this.mouse_last_x_y = [mouseX,mouseY];
				this.mouse_dragged_displacement = [0,0];
				const selected_note = this.getSelectedNote();
				const selected_gracenote = this.getSelectedGracenote();
				const selected_barline = this.getSelectedBarline();
				const selected_text = this.getSelectedText();
				const selected_time_sig = this.getSelectedTimeSignature();
				if ((this.menu_mode === 'note') && (selected_note != null)) {
					selected_note.selected = true;
					this.notes = this.sortedNotes;
					this.last_gracenote_group = this.gracenoteGroups;
				} else if ((this.menu_mode === 'gracenote') && (selected_gracenote != null)) {
					selected_gracenote.selected = true;
				} else if ((this.menu_mode === 'layout') && (selected_barline != null)) {
					this.deselectAllBarlines();
					selected_barline.selected = true;
				} else if ((this.menu_mode === 'layout') && (selected_time_sig != null)) {
					selected_time_sig.select();
				} else if ((this.menu_mode === 'text') && (selected_text != null)) {
					this.deselectAllText();
					selected_text.select();
				} else {
					this.deselectAllNotes();
					this.deselectAllGracenotes();
					this.deselectAllBarlines();
					this.deselectAllText();
					this.deselectAllTimeSignatures();
					this.box_select = true;
				}
			}
		}
	}
	mouseReleased() {
		for (const note of this.selectedNotes) {
			note.resetActualY(this.snapNoteToLine);	// so that when dragging again, note starts at right place
		}
		for (const gracenote of this.gracenotes) gracenote.resetActualY(this.snapNoteToLine);
		for (const bl of this.selectedBarlines) bl.reset();
		this.mouse_dragged = false;
		this.box_select = false;
		this.last_gracenote_group = null;
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
			if (note.selected) selected.push(note);
		}
		return selected;
	}
	get selectedBarlines() {
		const selected = [];
		for (const bl of this.barlines) {
			if (bl.selected) selected.push(bl);
		}
		return selected;
	}
	get selectedTimeSignatures() {
		const selected = [];
		for (const ts of this.time_sigs) {
			if (ts.selected) selected.push(ts);
		}
		return selected;
	}
	get selectedTexts() {
		const selected = [];
		for (const t of this.texts) {
			if (t.selected) selected.push(t);
		}
		return selected;
	}
	get sortedNotes() {
		return this.notes.slice().sort((a,b) => (a.actual_x > b.actual_x) ? 1 : -1);
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
		if (keyCode === 71) {	// g - group
			this.groupSelectedNotes();
		} else if (keyCode === 85) { // u - ungroup
			this.ungroupSelectedNotes();
		} else if (keyCode === 68) { // d - dot
			document.getElementById('dot-notes-button').checked = !document.getElementById('dot-notes-button').checked;
			this.dotSelectedNotes();
		} else if (keyCode === 46) {	// delete
			this.deleteSelectedNotes();
		} else if (keyCode === 90 && keyIsDown(17)) {
			undo();
		}
	}
	mouseDraggedUpdate() {
		if (mouseButton === LEFT) {
			if (this.box_select) this.boxSelect();
			else {
				this.mouse_dragged_displacement = [0,0]
				if (mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height) {
					this.mouse_dragged_displacement[0] += mouseX-this.mouse_last_x_y[0];
					this.mouse_dragged_displacement[1] += mouseY-this.mouse_last_x_y[1];
				}
				this.selectedNotes.forEach(note => {
					const gracenote_group = this.last_gracenote_group[this.notes.indexOf(note)];
					if (note.drag(...this.mouse_dragged_displacement,this.stave.getActualCoordFromCanvasCoord,this.snapNoteToLine)) {
						for (let g of gracenote_group) {
							g.drag(this.mouse_dragged_displacement[0],0,this.stave.getActualCoordFromCanvasCoord,this.snapNoteToLine);
						}
					}
				});
				this.selectedGracenotes.forEach(note => {
					note.drag(...this.mouse_dragged_displacement,this.stave.getActualCoordFromCanvasCoord,this.snapNoteToLine);
				});
				this.selectedBarlines.forEach(bl => {
					bl.drag(...this.mouse_dragged_displacement);
				});
				this.selectedTexts.forEach(t => {
					t.drag(...this.mouse_dragged_displacement);
				});
				this.selectedTimeSignatures.forEach(ts => {
					ts.drag(...this.mouse_dragged_displacement);
				})
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
	mouseDragged() {
		this.mouse_dragged = true;
	}
	dotSelectedNotes() {
		const dotted = !document.getElementById('dot-notes-button').checked;
		this.selectedNotes.forEach(n => n.dotted = !dotted);
	}
	groupSelectedNotes() {
		const selected_notes = this.selectedNotes;
		for (let note_ind=1;note_ind<selected_notes.length;note_ind++) {
			selected_notes[note_ind].addConnected(selected_notes[note_ind-1]);
			selected_notes[note_ind-1].addConnected(selected_notes[note_ind]);
		}
		this.deselectAllNotes();
	}
	ungroupSelectedNotes() {
		this.selectedNotes.forEach(note=>{
			note.unConnect();
		});
		this.deselectAllNotes();
	}
	toJSON() {
		if (!this.notes) return; // not setup yet
		let mapped_notes = this.notes.slice().map(n => {
			const { x,actual_y,name,type,dotted,connected_after,connected_before } = n;
			const note = { x,actual_y,name,type,dotted,connected_after,connected_before };
			if (note.connected_before) note.connected_before = this.notes.indexOf(note.connected_before);
			if (note.connected_after) note.connected_after = this.notes.indexOf(note.connected_after);
			return note;
		});
		return {
			name: this.name,
			id: this.id,
			stave: this.stave,
			notes: mapped_notes,
			gracenotes: this.gracenotes,
			texts: this.texts,
			time_sigs: this.time_sigs,
			barlines: this.barlines
		};
	}
	static fromJSON(json) {
		const obj = new this(setup=false);
		const obj_values = json;
		obj.id = obj_values.id;
		obj.name = obj_values.name;
		document.querySelector('#score-name input').value = obj.name;
		obj.stave = new Stave(setup=false,json=obj_values.stave);
		obj.demo_note = new DemoNote();
		obj.notes = obj_values.notes.map(note => {
			return new Note(note.x,note.actual_y,note.name,note.type,note.dotted,obj.stave.getActualCoordFromCanvasCoord);
		});
		for (let i=0;i<obj_values.notes.length;i++) {
			const note = obj_values.notes[i];
			if (note.connected_before != null) obj.notes[i].connected_before = obj.notes[note.connected_before];
			if (note.connected_after != null) obj.notes[i].connected_after = obj.notes[note.connected_after];
		}
		obj.gracenotes = obj_values.gracenotes.map(g => new Gracenote(g.x,g.y,g.name,obj.stave.getActualCoordFromCanvasCoord));
		obj.texts = obj_values.texts.map(t => new Text(t.x,t.y,t.text));
		obj.time_sigs = obj_values.time_sigs.map(ts => new TimeSignature(ts.x,ts.y,obj.stave))
		obj.barlines = obj_values.barlines.map(b => new Barline(b.x,b.y,obj.stave));

		return obj;
	}
}
