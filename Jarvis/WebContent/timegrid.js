/**
 * TimeGrid
 * starttime
 * endtime
 * minimumlevel
 * minimumlevelwidth
 * calendar
 * 
 * getStartTime	mit Aufbereitung abhängig vom Level
 * setStartTime
 * getEndTime
 * setEndTime
 * getMinimumLevel
 * setMinimumLevel
 */

function TimeGrid() {
	this.border = new LineFormat(7, LineFormat.SOLID, "blue");
	this.bandgroups = new Array();
}

TimeGrid.prototype.VERT_ALIGN_TOP = "T";
TimeGrid.prototype.VERT_ALIGN_MIDDLE = "M";
TimeGrid.prototype.VERT_ALIGN_BOTTOM = "B";
TimeGrid.prototype.HORI_ALIGN_CENTER = "C";
TimeGrid.prototype.HORI_ALIGN_LEFT = "L";
TimeGrid.prototype.HORI_ALIGN_RIGHT = "R";
TimeGrid.prototype.HORI_ALIGN_JUSTIFY = "J";

TimeGrid.prototype.getStartTime = function() {
	return this.starttime;
}

TimeGrid.prototype.setStartTime = function(start) {
	this.starttime = start;
}

TimeGrid.prototype.getEndTime = function() {
	return this.endtime;
}

TimeGrid.prototype.setEndTime = function(end) {
	this.endtime = end;
	this.setCalcEndTime();
}

TimeGrid.prototype.getCalcEndTime = function() {
	return this.calcendtime;
}

TimeGrid.prototype.setCalcEndTime = function() {
	this.calcendtime = new Date(this.endtime);
	this.calcendtime.addDay(1);
}

TimeGrid.prototype.getLevel = function(code) {
	var erg = null;
	for (i=0;i<this.levels.length;i++) {
		if (this.levels[i].code == code) {
			erg = this.levels[i];
			break;
		};
	}
	return erg;
}

TimeGrid.prototype.setLevel = function(level) {
}

TimeGrid.prototype.draw = function(canvas) {
	var context = canvas.getContext("2d");
	var w = canvas.width;
	var h = canvas.height;
	var bw = this.border.width;
	var bc = this.border.color;
	context.textBaseline = "middle";
	
	if (this.border.width > 0) {
		DrawHelper_Line(context, 0, 0, w, 0, bw, bc, 1);
		DrawHelper_Line(context, w, 0, w, h, bw, bc, -1);
		DrawHelper_Line(context, 0, 0, 0, h, bw, bc, 1);
		DrawHelper_Line(context, 0, h, w, h, bw, bc, -1);
	}  

	this.ix0 = this.border.width;
	this.iy0 = this.border.width;
	this.ix1 = w - this.border.width;
	this.iy1 = h - this.border.width;
//	DrawHelper_Line(context, this.ix0, 60, this.ix1, 60, 1, "black", 0.5);

	var bg = this.bandgroups[0];
	for (i=0;i<this.levels.length;i++) {
		var level = this.levels[i];
		this.drawLines(context, bg.bands[i], level)
		var posy = this.iy0 + level.offset + level.height;
		DrawHelper_Line(context, this.ix0, posy, this.ix1, posy, level.border.width, level.border.color, 0.5);
	}
}


TimeGrid.prototype.drawLines = function(context, band, level) {
	var yoffset = band.top;
	if (level.type == level.VALUE) yoffset += band.height;
	var year = this.starttime.getFullYear();
	var d1 = new Date(2015, 0, 1);
	var kw = d1.getWeek();
	var epoche = 0;
	if (year > 0) epoche = 1;
	var month = this.starttime.getMonth();
	var diff = 1000000000;
	var nexttime = new Date(this.starttime.getTime());
	var text = nexttime.format(level.format);
	var xoffset = 0;
	var lastx = this.ix0;
	var endy = this.iy1;
	if (level.linelength == 0) endy = band.top + band.height;
	if (level.code == level.EPOCHE) {
		nexttime = new Date(1,0,1);
		nexttime.setDate(1);
		if (nexttime.getTime() > this.starttime.getTime() && nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Text(context,text, this.ix0, band.top, xoffset, band.top + band.height, level.textformat);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			text = this.calcendtime.format(level.format);
			DrawHelper_Text(context,text, xoffset, this.iy0 + level.offset, this.ix1, this.iy0 + level.offset + level.height, level.textformat);
		} else {
			
		}
	} else if (level.code == level.MILLENIUM) {
	} else if (level.code == level.CENTURY) {
	} else if (level.code == level.DECADE) {

	} else if (level.code == level.YEAR) {
		nexttime.addYear(level.units);
		nexttime.setDate(1);
		nexttime.setMonth(0);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addYear(level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);

	} else if (level.code == level.MONTH) {
		nexttime.addMonth(level.units);
		nexttime.setDate(1);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addMonth(level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);

	} else if (level.code == level.WEEK) {
		nexttime.addDay(7 - ((nexttime.getDay()+6) %7) + (level.units-1) * 7);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addDay(7 * level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
		
	} else if (level.code == level.MONDAY) {
		if (nexttime.getDay() > 0) {
			text = "";
		}
		nexttime.addDay(7 - ((nexttime.getDay()+6) %7) + (level.units-1) * 7);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addDay(7 * level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
		
	} else if (level.code == level.DAY) {
		nexttime.addDay(level.units);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addDay(level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
	} else if (level.code == level.HOUR) {
	} else if (level.code == level.MINUTE) {
	} else if (level.code == level.SECOND) {
	} else if (level.code == level.MILLIS) {
	}
}

TimeGrid.prototype.drawLines2 = function(context, level) {
	var yoffset = this.iy0 + level.offset;
	if (level.type == level.VALUE) yoffset += level.height;
	var year = this.starttime.getFullYear();
	var d1 = new Date(2015, 0, 1);
	var kw = d1.getWeek();
	var epoche = 0;
	if (year > 0) epoche = 1;
	var month = this.starttime.getMonth();
	var diff = 1000000000;
	var nexttime = new Date(this.starttime.getTime());
	var text = nexttime.format(level.format);
	var xoffset = 0;
	var lastx = this.ix0;
	var endy = this.iy1;
	if (level.linelength == 0) endy = this.iy0 + level.offset + level.height;
	if (level.code == level.EPOCHE) {
		nexttime = new Date(1,0,1);
		nexttime.setDate(1);
		if (nexttime.getTime() > this.starttime.getTime() && nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Text(context,text, this.ix0, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			text = this.calcendtime.format(level.format);
			DrawHelper_Text(context,text, xoffset, this.iy0 + level.offset, this.ix1, this.iy0 + level.offset + level.height, level.textformat);
		} else {
			
		}
	} else if (level.code == level.MILLENIUM) {
	} else if (level.code == level.CENTURY) {
	} else if (level.code == level.DECADE) {

	} else if (level.code == level.YEAR) {
		nexttime.addYear(level.units);
		nexttime.setDate(1);
		nexttime.setMonth(0);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addYear(level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);

	} else if (level.code == level.MONTH) {
		nexttime.addMonth(level.units);
		nexttime.setDate(1);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addMonth(level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);

	} else if (level.code == level.WEEK) {
		nexttime.addDay(7 - ((nexttime.getDay()+6) %7) + (level.units-1) * 7);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addDay(7 * level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
		
	} else if (level.code == level.MONDAY) {
		if (nexttime.getDay() > 0) {
			text = "";
		}
		nexttime.addDay(7 - ((nexttime.getDay()+6) %7) + (level.units-1) * 7);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addDay(7 * level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
		
	} else if (level.code == level.DAY) {
		nexttime.addDay(level.units);
		while (nexttime.getTime() < this.calcendtime.getTime()) {
			xoffset = this.calcOffset(nexttime);
			DrawHelper_Line(context, xoffset, yoffset, xoffset, endy, level.lineformat.width, level.lineformat.color, 0.5);
			DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
			text = nexttime.format(level.format);
			nexttime.addDay(level.units);
			lastx = xoffset;
		} 
		xoffset = this.calcOffset(this.calcendtime);
		DrawHelper_Text(context,text, lastx, this.iy0 + level.offset, xoffset, this.iy0 + level.offset + level.height, level.textformat);
	} else if (level.code == level.HOUR) {
	} else if (level.code == level.MINUTE) {
	} else if (level.code == level.SECOND) {
	} else if (level.code == level.MILLIS) {
	}
}

TimeGrid.prototype.calcOffset = function(time) {
	var xoffset = this.ix0 + (this.ix1 - this.ix0 + 1) * (time.getTime() - this.starttime.getTime())/(this.calcendtime.getTime() - this.starttime.getTime());
	var offset = Math.round(xoffset);
//	sysout.println(time + ", Offset: " + offset);
	return offset;
}

Date.prototype.addDay = function(anz) {
	var offset1 = this.getTimezoneOffset();
	this.setTime(this.getTime() + anz * 86400000);
	var offset2 = this.getTimezoneOffset();
	this.setTime(this.getTime() + (offset2 - offset1)*60000);
}

Date.prototype.addMonth = function(anz) {
	var m = this.getMonth()  + anz;
	var y = Math.div(m, 12);
	m = Math.mod(m, 12);
	if (y != 0) {
		this.setYear(this.getFullYear() + y);
	}
	this.setMonth(m);
}

Date.prototype.addYear = function(anz) {
	var y = this.getFullYear()  + anz;
	this.setYear(y);
}

Date.prototype.monthshort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

Date.prototype.format = function(format) {
	var erg = "";
	if (format == "G") {
		if (this.getFullYear() > 0) {
			erg = "AD"; 
		} else {
			erg = "BC";
		}
	} else if (format == "yyyy") {
		erg = this.getFullYear().toString();
	} else if (format == "MMM") {
		erg = this.monthshort[this.getMonth()];
	} else if (format == "ww") {
		erg = " " + (100 + this.getWeek());
		erg = erg.substring(2);
	} else if (format == "dd") {
		erg = " " + (100 + this.getDate());
		erg = erg.substring(2);
	} else if (format == "d") {
		erg = " " + this.getDate();
		erg = erg.substring(1);
	}
	return erg;
}

Date.prototype.getWeek = function() {
   var datum = new Date(this.getTime() - this.getTimezoneOffset() * 60000);
   var j = datum.getYear();
   if (1900 > j) j +=1900;
   var m = datum.getMonth();
   var t = datum.getDate();

//   var Datum = new Date(j,m,t,3,0,1);
//   sysout.println(this + " -> " + datum);
   var tag = datum.getDay(); if (tag == 0) tag = 7;
   var d = new Date(2004,0,1).getTimezoneOffset();
   var Sommerzeit = (Date.UTC(j,m,t,0,d,1) - Number(datum)) /3600000;
   datum.setTime(Number(datum) + Sommerzeit*3600000 - (tag-1)*86400000);
   var jahr = datum.getYear(); if (1900 > jahr) jahr +=1900;
   var kw = 1;
   if (new Date(jahr,11,29) > datum) {
     var start = new Date(jahr,0,1);
     start = new Date(Number(start) + 86400000*(8-start.getDay()));
     if(start.getDate() > 4) start.setTime(Number(start) - 604800000);
     kw = Math.ceil((datum.getTime() - start) /604800000);
   }
   return kw;
}

Date.prototype.getWeek2 = function() {
	var offset = this.getTimezoneOffset();
	var day = this.getDay();
	var DonnerstagDat = new Date(this.getTime() - offset * 60000 + (3-((day+6) % 7)) * 86400000);
	var KWJahr = DonnerstagDat.getFullYear();
	var DonnerstagKW = new Date(new Date(KWJahr,0,4).getTime() + (3-((new Date(KWJahr,0,4).getDay()+6) % 7)) * 86400000);
	var KW = Math.floor(1.5 + (DonnerstagDat.getTime() + DonnerstagDat.getTimezoneOffset() - DonnerstagKW.getTime() - DonnerstagKW.getTimezoneOffset()) / 86400000/7);
	return KW;
}

Math.div = function(number1, number2) {
	var erg = Math.floor(number1 / number2);
	if (erg < 0) erg = erg + 1;
	return erg;
}

Math.mod = function(number1, number2) {
	var erg = Math.floor(number1 / number2);
	if (erg < 0) erg = erg + 1;
	erg = number1 - erg * number2; 
	return erg;
}

TimeGrid.prototype.setLevels = function(levels) {
	var bg = this.addBandGroup(new BandGroup("levels"));
	bg.height = 30;
	bg.paddingTop = this.border.width;
	bg.paddingBottom = 5;
	
	this.levels = new Array();
	var offset = 0;
	for (i=0;i<levels.length;i++) {
		var level = new TimeLevel(levels.substring(i,i+1));
		var b = this.addBand(new Band(level.code));
		b.height = level.height;
		
		level.offset = offset;
		offset += level.height;
		this.levels[this.levels.length] = level;
	}
}

function UTCDate(year, month, date) {
	return Date.UTC(year, month, date);
}

function DrawHelper_Text(context, text, x0, y0, x1, y1, textformat) {
	context.font = textformat.font;
	context.fillStyle = textformat.color;
	var t = context.measureText(text);
	var x = Math.floor(x0 + (x1 - x0 - t.width) / 2);
	context.fillText(text, x, Math.floor(y0 + (y1 - y0) / 2));
}

function DrawHelper_Line2(context, x0, y0, x1, y1, lineformat, offset) {
	var xx0, yy0, xx1, yy1;

	if (x0 == x1) {	// vertical line
		yy0 = y0;
		yy1 = y1;
		if (Math.abs(offset) == 0.5) {
			xx0 = x0 + offset;
		} else {
			xx0 = x0 + (offset * width/2);
		}
		xx1 = xx0;
	} else if (y0 == y1) {	// horizontal line
		xx0 = x0;
		xx1 = x1;
		if (Math.abs(offset) == 0.5) {
			yy0 = y0 + offset;
		} else {
			yy0 = y0 + (offset * width/2);
		}
		yy1 = yy0;
	} else {
		xx0 = x0;
		yy0 = y0;
		xx1 = x1;
		yy1 = y1;
	}
	context.moveTo(xx0,yy0);
	context.lineWidth = width;
   	context.strokeStyle = 'blue';
//   	context.fillStyle = 'green';
   	context.lineTo(xx1,yy1);
   	context.stroke();
}

function DrawHelper_Line(context, x0, y0, x1, y1, width, color, offset) {
	var xx0, yy0, xx1, yy1;

	if (x0 == x1) {	// vertical line
		yy0 = y0;
		yy1 = y1;
		if (Math.abs(offset) == 0.5) {
			xx0 = x0 + offset;
		} else {
			xx0 = x0 + (offset * width/2);
		}
		xx1 = xx0;
	} else if (y0 == y1) {	// horizontal line
		xx0 = x0;
		xx1 = x1;
		if (Math.abs(offset) == 0.5) {
			yy0 = y0 + offset;
		} else {
			yy0 = y0 + (offset * width/2);
		}
		yy1 = yy0;
	} else {
		xx0 = x0;
		yy0 = y0;
		xx1 = x1;
		yy1 = y1;
	}
	context.beginPath();
	context.moveTo(xx0,yy0);
	context.lineWidth = width;
   	context.strokeStyle = color;
   	context.lineTo(xx1,yy1);
   	context.stroke();
}
/**
 * TimeLevel
 * 
 * level:	GybqMwdHmsS (accordung to Java date/time formats (only single character)
 * 				special cases; b half year, q quarter (1 .. 4), t millenium(now is 2, no negatives) , c century (now is 21), j decade (0 .. 9)
 * format:	yyyy (according to java date/time formats
 * height:	height (px)
 * border: 	LineFormat
 * lineformat: 	LineFormat
 * linelength:	0:	nur Unterteilung, 1: über ganzes Grid
 * textformat:	TextFormat
 * 
 * width:	width (px)
 * units:	nr of units to be grouped together (only middle with title)
 * type:	RANGE, VALUE
 * 			normally range if not minimum level, if minimum level the following are value: dHmsS
 */
function TimeLevel(code) {
	this.units = 1;
	this.code = code;
	this.height = 20;
	this.offset = 0;
	this.type = this.RANGE;
	this.align = TimeGrid.VERT_ALIGN_MIDDLE;
	this.border = new LineFormat(1, LineFormat.SOLID , 'black');
	this.lineformat = new LineFormat(1, LineFormat.SOLID , 'black');
	this.linelength = 1;
	this.textformat = new TextFormat('12px/14px sans-serif', 'black');
	this.fillCode();
}

TimeLevel.prototype.EPOCHE = "G";
TimeLevel.prototype.MILLENIUM = "t";
TimeLevel.prototype.CENTURY = "c";
TimeLevel.prototype.DECADE = "j";
TimeLevel.prototype.YEAR = "y";
TimeLevel.prototype.HALFYEAR = "b";
TimeLevel.prototype.QUARTER = "q";
TimeLevel.prototype.MONTH = "M";
TimeLevel.prototype.WEEK = "w";
TimeLevel.prototype.DAY = "d";
TimeLevel.prototype.MONDAY = "f";
TimeLevel.prototype.HOUR = "H";
TimeLevel.prototype.MINUTE = "m";
TimeLevel.prototype.SECOND = "s";
TimeLevel.prototype.MILLIS = "S";

TimeLevel.prototype.RANGE = "R";
TimeLevel.prototype.VALUE = "V";

TimeLevel.prototype.fillCode = function() {
	if (this.code == this.EPOCHE) {
		this.format = "G";
		this.type = this.RANGE;
	} else if (this.code == this.MILLENIUM) {
		this.format = "t";
		this.type = this.RANGE;
	} else if (this.code == this.CENTURY) {
		this.format = "cc";
		this.type = this.RANGE;
	} else if (this.code == this.DECADE) {
		this.format = "jj";
		this.type = this.RANGE;
	} else if (this.code == this.YEAR) {
		this.format = "yyyy";
		this.type = this.RANGE;
	} else if (this.code == this.MONTH) {
		this.format = "MMM";
		this.type = this.RANGE;
	} else if (this.code == this.WEEK) {
		this.format = "ww";
		this.type = this.RANGE;
	} else if (this.code == this.DAY) {
		this.format = "dd";
		this.type = this.RANGE;
	} else if (this.code == this.MONDAY) {
		this.format = "d";
		this.type = this.RANGE;
	} else if (this.code == this.HOUR) {
		this.format = "HH";
		this.type = this.RANGE;
	} else if (this.code == this.MINUTE) {
		this.format = "mm";
		this.type = this.RANGE;
	} else if (this.code == this.SECOND) {
		this.format = "ss";
		this.type = this.RANGE;
	} else if (this.code == this.MILLIS) {
		this.format = "SSS";
		this.type = this.RANGE;
	}
}

function DateInfo(start, ende) {
	
}

// andere JS

/**
 * LineFormat
 * width
 * style
 * color
 */
function LineFormat(width, style, color) {
	this.width = width;
	this.style = style;
	this.color = color;
}

LineFormat.prototype.SOLID = "solid";

/**
 * TextFormat
 * font
 * style
 * size
 * color
 */
function TextFormat(font, color) {
	this.font = font;
	this.color = color;
}


var sysout;

function Log(id) {
	this.id = id;
	this.out = $("#" + id);
}

Log.prototype.print = function(text) {
	var old = this.out.html();
	this.out.html(old + text);
}

Log.prototype.println = function(text) {
	this.print(text + "<br>");
}

function BandGroup(name) {
	this.name = name;
	this.bands = new Array();
	this.paddingTop = 0;
	this.paddingBottom = 0;
	this.spacingX = 0;
	this.height = 0;
	this.bands = new Array();
	return this;
}

function Band(name) {
	this.name = name;
	this.height = 0;
	this.top = 0;
	return this;
}

BandGroup.prototype.addBand = function(band) {
	this.bands[this.bands.length] = band;
	return band;
}

TimeGrid.prototype.addBandGroup = function(bandgroup) {
	this.bandgroups[this.bandgroups.length] = bandgroup;
	return bandgroup;
}

TimeGrid.prototype.getBandGroup = function(name) {
	var erg = null;
	for (var i=0;i<this.bandgroups.length;i++) {
		var bg = this.bandgroups[i];
		if (bg.name == name) {
			erg = bg;
			break;
		}
	}
	return erg;
}

TimeGrid.prototype.addBand = function(band) {
	var bg = this.bandgroups[this.bandgroups.length-1];
	bg.addBand(band);
	if (band.height == 0) band.height = bg.height;
	return band;
}

TimeGrid.prototype.calcSize = function() {
	var h = 0;
	for (var i=0;i<this.bandgroups.length;i++) {
		var bg = this.bandgroups[i];
		h += bg.paddingTop;
		for (var j=0;j<bg.bands.length;j++) {
			if (j > 0) h += bg.spacingX;
			var b = bg.bands[j];
			b.top = h;
			h += b.height;
		}
		h = h + bg.paddingBottom;
	}
	this.height = h;
	return h;
}



