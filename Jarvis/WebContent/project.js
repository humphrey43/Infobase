var portfolio = new Portfolio("RDB");
var project;

function Project(name) {
	this.application = "";
	this.version = "";
	this.name = "";
	this.start = null; 
	this.end = null;
	this.milestones = new Array();
}

Project.prototype.newMilestone = function(name, date) {
	var m = new Milestone(name,assertDate(date));
	this.milestones[this.milestones.length] = m;
}

Project.prototype.setStartDate = function(date) {
	this.start = assertDate(date);
}

Project.prototype.setEndDate = function(date) {
	this.start = assertDate(date);
}

function assertDate(date) {
	var erg = null;
	var d = date;
	if (d instanceof Date) {
		erg = d;
	} else {
		var parts = date.split(".");
		if (parts.length == 3) {
			var d = parseNumber(parts[0], 1, 31);
			var m = parseNumber(parts[1], 1, 12);
			var j = parseNumber(parts[2], 1900, 2099);
			if (d > 0 && m > 0 && j > 0) {
				erg = new Date(j, m-1, d);
			}
		}
	}
	return erg;
}

function parseNumber(text, min, max) {
	var number = -1;
	var n = Number(text);
	if (!isNaN(text)) {
		if (n >= min && n <= max) {
			number = n;
		}
	}
	return number;
}

function Portfolio(name) {
	this.name = name;
	this.projects = new Array();
}

Portfolio.prototype.addProject = function(project) {
	this.projects[this.projects.length] = project;
	return project;
}

function Milestone(name, date) {
	this.name = name;
	this.date = date; 
}

Milestone.prototype.draw = function(canvas, offset, rect) {
	var tr = new fabric.Triangle({
//		  left: offset,
//		  top: rect.y1 + Math.floor((rect.y1 - rect.y1) / 2) - 1 ,
		  fill: 'red',
		  stroke: 'black',
		  width: 32,
		  height: 24,
		  flipY: true,
		  originX: 'center',
		  originY: 'center'
		});
//	tr.hasControls = false;
//	tr.hasRotatingPoint = false;
//	tr.lockMovementY = true;
/*	context.font = textformat.font;
	context.fillStyle = textformat.color; */
//	var t = context.measureText(text);
//	context.fillText(text, x, Math.floor(y0 + (y1 - y0) / 2));
	var t = new fabric.Text(this.name, {
		fontStyle: '10px sans-serif',
		fill: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		originX: 'center',
		originY: 'center'
	});
//	t.fontStyle = "8px sans-serif";
//	t.color = "white";
	var x = Math.floor(tr.left + (tr.width - t.width) / 2);
	t.left = x;
	var y = Math.floor(tr.top + Math.floor((tr.height - t.height) / 2) - 1)
	t.top = y;
 	t.height = 0;
 	t.top = -12;
 	t.left = 0;
	var group = new fabric.Group([tr, t], {
		hasControls:false,
		hasRotatingPoint:false,
		selectable: false,
		lockMovementX: true,
		lockMovementY: true,
		left: offset,
		top: rect.y1 + Math.floor((rect.y2 - rect.y1) / 2) - 1,
		originX: 'center',
		originY: 'center'
	});
		// "add" rectangle onto canvas
	canvas.add(group).setActiveObject(group);
//	canvas.add(t);
/*            		canvas.on('mouse:down', function(options) {
			rect1.left = rect1.left + 100;
			canvas.renderAll();
		}); */
 /*   	context.fillStyle = "red";
    	context.strokeStyle="black";
    	context.beginPath();
    	context.moveTo(x-16, y);
    	context.lineTo(x+16,y);
    	context.lineTo(x,y+24);
    	context.closePath();
    	context.fill();
    	context.stroke();
    	var tf = new TextFormat('8px sans-serif', 'white');
    	DrawHelper_Text(context, text, x-16, y, x+16, y+16, tf); */
	
}

function Rectangle(x1, y1, x2, y2) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
}