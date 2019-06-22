const STAVEWIDTH = 100;
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
		this.stave = new Stave(2);
		this.demo_note = new DemoNote();
		this.pdf = createPDF();
		this.pdf.beginRecord();
		this.grace = new Gracenote();
		
		document.getElementById('dot-notes-button').addEventListener('click',()=>this.dotSelectedNotes());

		this.mode = 'create';
		this.note_mode = 'crotchet';
		this.menu_mode = 'note-title';
		this.notes = [];
	}
	draw() {
		background(255);
		this.update_note_mode();
		this.stave.draw();
		this.update_demo_note();
		this.drawNotes();
		this.grace.drawNotes();
		if (this.mouse_dragged) this.mouseDraggedUpdate();
	}
	update_note_mode() {
		this.note_mode = $('input[name=note]:checked', '#note_mode').val();
		this.mode = $("#mode").val();
		this.menu_mode = document.querySelector('#menu-titles .viewing').id.replace('-title','');
		if (this.mode!="select") {
			this.deselectAllNotes();
		}
	}
	update_demo_note() {
		if (this.mode=="create" && this.menu_mode=='note') {
			this.demo_note.update(this.stave);
			this.demo_note.draw();
		}
	}
	drawNotes() {
		for (const note of this.notes) {
			note.draw(this.stave);
		}
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
			if (note.x>left && note.x<right && note.actual_y>top && note.actual_y<bottom) note.selected=true;
		});
	}
	getSelectedNote() {
		var selected;
		for (const note of this.notes) {
			if (note.checkIfSelected(mouseX,mouseY)) {
				selected = note;
			}
		}
		return selected;
	}
	deselectAllNotes() {
		for (const note of this.selectedNotes) {
			note.selected=false;
		}
		this.box_select = false;
	}
	mousePress() {
		if (mouseButton==LEFT) {
			if (this.mode=="create") {
				if (this.menu_mode=='note') {
					const selected_note = this.getSelectedNote();
					if (selected_note==null) {
						const x = mouseX;
						if (x>0 && x<width) {
							const snapped = this.stave.snapToLine(mouseY);
							if (snapped!=null) {
								const y = snapped[0];
								let note = snapped[1];
							
								note = new Note(this.stave, mouseX,mouseY,this.note_mode);
								this.notes.push(note);
							}
						}
					}
				} else if (this.menu_mode=='gracenote') {
					this.grace.addNote(this.stave,mouseX,mouseY);
				}
			} else if (this.mode=="select") {
				this.mouse_original_x_y = [mouseX,mouseY];
				this.mouse_last_x_y = [mouseX,mouseY];
				this.mouse_dragged_displacement = [0,0];
				const selected_note = this.getSelectedNote();
				if (selected_note != null) {
					selected_note.selected=true;
					this.box_select = false;
				} else {
					this.deselectAllNotes();
					this.box_select = true;
				}
			}
		} else if (mouseButton==CENTER) {
			this.pdf.save();
		}
	}
	mouseReleased() {
		for (const note of this.selectedNotes) {
			note.actual_y = note.y;	// so that when dragging again, note starts at right place
		}
		this.mouse_dragged = false;
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
		if (keyCode == ESCAPE) {
			if (this.mode=="create") {
				$("#mode").val("select");
			} else if (this.mode=="select") {
				$("#mode").val("create");
			}
		} else if (keyCode == 71) {	// g
			if (this.mode=="select") {
				const selected_notes = this.selectedNotes.sort((a,b) => (a.x>b.x) ? 1 : -1);
				for (var note_ind=1;note_ind<selected_notes.length;note_ind++) {
					selected_notes[note_ind].addConnected(selected_notes[note_ind-1]);
					selected_notes[note_ind-1].addConnected(selected_notes[note_ind]);
				}
			}
		} else if (keyCode == 85) { //u
			if (this.mode=="select") {
				this.selectedNotes.forEach(note=>{
					if (note.connected_before!=null && note.connected_before.selected) {
						note.connected_before.connected_after = null;
						note.connected_before = null;
					}
					if (note.connected_after!=null && note.connected_after.selected) {
						note.connected_after.connected_before = null;
						note.connected_after = null;
					}
				});
			}
		} else if (keyCode == 68) { //d
			if (this.mode=="select") {
				this.dotSelectedNotes();
			}
		}
	}
	mouseDraggedUpdate() {
		if (this.mode=="select") {
			if (mouseButton==LEFT) {
				if (this.box_select) this.boxSelect();
				else {
					this.mouse_dragged_displacement[0]+=mouseX-this.mouse_last_x_y[0];
					this.mouse_dragged_displacement[1]+=mouseY-this.mouse_last_x_y[1];
					for (const note of this.selectedNotes) {
						note.x += this.mouse_dragged_displacement[0];
						note.actual_y += this.mouse_dragged_displacement[1];
					}
					this.mouse_last_x_y = [mouseX,mouseY];
					this.mouse_dragged_displacement = [0,0];


					const selected_notes = this.selectedNotes.sort((a,b) => (a.x>b.x) ? 1 : -1);
					selected_notes.forEach(note => {
						if (note.connected_before!=null && note.x<note.connected_before.x) {
							const first_note = note.connected_before.connected_before;
							note.connected_before.connected_before = note;
							note.connected_before.connected_after = note.connected_after;
							if (note.connected_after!=null) note.connected_after.connected_before = note.connected_before;
							note.connected_after = note.connected_before;
							note.connected_before = first_note;
							if (first_note!=null) first_note.connected_after = note;
						} else if (note.connected_after!=null && note.x>note.connected_after.x) {
							const final_note = note.connected_after.connected_after;
							note.connected_after.connected_after = note;
							note.connected_after.connected_before = note.connected_before;
							if (note.connected_before!=null) note.connected_before.connected_after = note.connected_after;
							note.connected_before = note.connected_after;
							note.connected_after = final_note;
							if (final_note!=null) final_note.connected_before = note;
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
		this.selectedNotes.forEach(n=>n.dotted=!n.dotted);
	}
}
