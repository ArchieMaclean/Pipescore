const STAVEWIDTH = 100;
const STAVELINEWIDTH = 13;
const MARGIN = 30;
const SELECTED_COLOUR = [0,0,200];
const CLICK_MARGIN = 5;

let notes = [];
let trebleClef,note_tail, blue_note_tail,stave,demo_note,cnv;

let mode = "create";
let note_mode="crotchet";
let note_colour=0;
let mouse_last_x_y;
let mouse_original_x_y;
let mouse_dragged_displacement;
let box_select = false;
let mouse_dragged = false;

function setup() {
    cnv = createCanvas(210*5,297*5);
    cnv.parent('page')
	background(255);
	cnv.mousePressed(mousePress);
    trebleClef = loadImage('/images/trebleClef.png');     // 375 x 640
    note_tail = loadImage('/images/noteTail.png');          // 72 x 155
	blue_note_tail = loadImage('/images/blueNoteTail.png');
    stave = new Stave(2);
    demo_note = new DemoNote();
    pdf = createPDF();
    pdf.beginRecord();
	
	document.getElementById('dot-notes-button').addEventListener('click',()=>dotSelectedNotes());
}

function draw() {
	background(255);
    update_note_mode();
    stave.draw();
    update_demo_note();
    drawNotes();
	if (mouse_dragged) mouseDraggedUpdate();
}

function update_note_mode() {
    note_mode = $('input[name=note]:checked', '#note_mode').val();
	note_colour = (note_mode=="semibreve" || note_mode=="minim") ? [0,0,0,0] : 0;
	mode = $("#mode").val();
	if (mode!="select") {
		deselectAllNotes();
	}
}

function update_demo_note() {
	if (mode=="create") {
		demo_note.update(stave);
		demo_note.draw();
	}
}


function drawNotes() {
    for (note of notes) {
        note.draw(stave);
    }
}

function boxSelect() {
	fill(50,50,150,150);
	strokeWeight(0);
	const x = mouse_original_x_y[0];
	const y = mouse_original_x_y[1]
	rect(x,y,mouseX-x,mouseY-y);
	const left = Math.min(x,mouseX);
	const right = Math.max(x,mouseX);
	const top = Math.min(y,mouseY);
	const bottom = Math.max(y,mouseY);
	notes.forEach(note => {
		if (note.x>left && note.x<right && note.actual_y>top && note.actual_y<bottom) note.selected=true;
	});
}

function getSelectedNote() {
    var selected;
    for (note of notes) {
		if (note.checkIfSelected(mouseX,mouseY)) {
			selected = note;
		}
    }
    return selected;
}

function deselectAllNotes() {
	for (note of selectedNotes()) {
		note.selected=false;
	}
	box_select = false;
}

function mousePress() {
    if (mouseButton==LEFT) {
		if (mode=="create") {
			selected_note = getSelectedNote();
			if (selected_note==null) {
				const x = mouseX;
				if (x>0 && x<width) {
					const snapped = stave.snapToLine(mouseY);
					if (snapped!=null) {
						const y = snapped[0];
						let note = snapped[1];
					
						note = new Note(stave, mouseX,mouseY,note_mode,note_colour);
						notes.push(note);
					}
				}
			}
		} else if (mode=="select") {
			mouse_original_x_y = [mouseX,mouseY];
			mouse_last_x_y = [mouseX,mouseY];
			mouse_dragged_displacement = [0,0];
			const selected_note = getSelectedNote();
			if (selected_note != null) {
				selected_note.selected=true;
				box_select = false;
			} else {
				deselectAllNotes();
				box_select = true;
			}
		}
    } else if (mouseButton==CENTER) {
        pdf.save();
    }
}

function mouseReleased() {
	for (note of selectedNotes()) {
		note.actual_y = note.y;	// so that when dragging again, note starts at right place
	}
	mouse_dragged = false;
}

function selectedNotes() {
	var selected = [];
	for (note of notes) {
		if (note.selected) {
			selected.push(note);
		}
	}
	return selected;
}

function keyPressed() {
	if (keyCode == ESCAPE) {
		if (mode=="create") {
			$("#mode").val("select");
		} else if (mode=="select") {
			$("#mode").val("create");
		}
	} else if (keyCode == 71) {	// g
		if (mode=="select") {
			selected_notes = selectedNotes().sort((a,b) => (a.x>b.x) ? 1 : -1);
			for (var note_ind=1;note_ind<selected_notes.length;note_ind++) {
				selected_notes[note_ind].addConnected(selected_notes[note_ind-1]);
				selected_notes[note_ind-1].addConnected(selected_notes[note_ind]);
			}
		}
	} else if (keyCode == 85) { //u
		if (mode=="select") {
			selectedNotes().forEach(note=>{
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
		if (mode=="select") {
			dotSelectedNotes();
		}
	}
}

// function containing stuff that updates when mouse dragged, so I can control order of draw
function mouseDraggedUpdate() {
	if (mode=="select") {
		if (mouseButton==LEFT) {
			if (box_select) boxSelect();
			else {
				mouse_dragged_displacement[0]+=mouseX-mouse_last_x_y[0];
				mouse_dragged_displacement[1]+=mouseY-mouse_last_x_y[1];
				for (note of selectedNotes()) {
					note.x += mouse_dragged_displacement[0];
					note.actual_y += mouse_dragged_displacement[1];
				}
				mouse_last_x_y = [mouseX,mouseY];
				mouse_dragged_displacement = [0,0];


				selected_notes = selectedNotes().sort((a,b) => (a.x>b.x) ? 1 : -1);
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

function mouseDragged() {
	mouse_dragged = true;	
}

function dotSelectedNotes() {
	selectedNotes().forEach(n=>n.dotted=!n.dotted);
}
