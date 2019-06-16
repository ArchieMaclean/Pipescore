const STAVEWIDTH = 100;
const STAVELINEWIDTH = 13;
const MARGIN = 30;
const SELECTED_COLOUR = [0,0,200];
const CLICK_MARGIN = 5;

var notes = [];
var trebleClef,note_tail, blue_note_tail,stave,demo_note,cnv;

var mode = "create";
var note_mode="crotchet";
var note_colour=0;
var mouse_original_x_y;
var mouse_dragged_displacement;

function setup() {
    cnv = createCanvas(210*5,297*5);
    cnv.parent('page')
    trebleClef = loadImage('/images/trebleClef.png');     // 375 x 640
    note_tail = loadImage('/images/noteTail.png');          // 72 x 155
	blue_note_tail = loadImage('/images/blueNoteTail.png');
    stave = new Stave(2);
    demo_note = new DemoNote();
    pdf = createPDF();
    pdf.beginRecord();
}

function draw() {
    background(255);
    update_note_mode();
    stave.draw();
    update_demo_note();
    drawNotes();
}

function update_note_mode() {
    note_mode = $('input[name=note]:checked', '#note_mode').val();
    switch (note_mode) {
        case 'semibreve':note_colour=[0,0,0,0]; break;
        case 'minim':note_colour=[0,0,0,0]; break;
        default: note_colour=0;
    }
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
}

function mousePressed() {
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
			mouse_dragged_displacement = [0,0];
			const selected_note = getSelectedNote();
			if (selected_note != null) {
				selected_note.selected=!(selected_note.selected);
			} else {
				deselectAllNotes();
			}
		}
    } else if (mouseButton==MIDDLE) {
        pdf.save();
    }
}

function mouseReleased() {
	for (note of notes) {
		note.actual_y = note.y;	// so that when dragging again, note starts at right place
	}
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
	}
}

function mouseDragged() {
	if (mode=="select") {
		if (mouseButton==LEFT) {
			mouse_dragged_displacement[0]+=mouseX-mouse_original_x_y[0];
			mouse_dragged_displacement[1]+=mouseY-mouse_original_x_y[1];
			for (note of selectedNotes()) {
				note.x += mouse_dragged_displacement[0];
				note.actual_y += mouse_dragged_displacement[1];
			}
			mouse_original_x_y = [mouseX,mouseY];
			mouse_dragged_displacement = [0,0];
		}
	}
}
