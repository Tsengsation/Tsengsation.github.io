// ---------------------------------------------------
//  Constants 
// ---------------------------------------------------
var scopeRadius = 125;
var scopeDistancePerFrame = 10;

var rayColor = 'white';
var rayWidth = 2;
var rayMinLength = 30;
var rayMaxLength = 70;

var rayDistancePerFrame = 20; 
var numRaysPerFrame = 15;

// ---------------------------------------------------
//  Ray 
// ---------------------------------------------------
var Ray = function(length, angle) {
	this.length = length;
	this.angle = angle;
	this.offset = new Point(rayDistancePerFrame * Math.cos(angle), rayDistancePerFrame * Math.sin(angle));
	var from = new Point(viewCenter.x + scopeRadius * Math.cos(angle), viewCenter.y + scopeRadius * Math.sin(angle));
	var to = new Point(viewCenter.x + (scopeRadius + length) * Math.cos(angle), viewCenter.y + (scopeRadius + length) * Math.sin(angle));
	this.line = new Path.Line(from, to);
	this.line.strokeColor = rayColor;
	this.line.strokeWidth = rayWidth;
};

Ray.prototype.iterate = function() {
	this.line.translate(this.offset);	
}

Ray.prototype.isVisible = function() {
	return (view.bounds.contains(this.line.getPointAt(0)));
}

Ray.prototype.delete = function() {
	this.line.remove();
}

// ---------------------------------------------------
//  Initializations
// ---------------------------------------------------
var rays = [];
var viewCenter = view.center;
var goalViewCenter = view.center;

// ---------------------------------------------------
//  Events
// ---------------------------------------------------
function onFrame() {
	updateScope();
	createNewRays();
	updateRays();
}

function onMouseMove(event) {
	goalViewCenter = event.point;
}

// ---------------------------------------------------
//  Helpers
// ---------------------------------------------------
function updateScope() {
	var difference = new Point(goalViewCenter.x - viewCenter.x, goalViewCenter.y - viewCenter.y);
	var distance = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2));
	if (distance != 0) {
		var offset = new Point(scopeDistancePerFrame / distance * difference.x, scopeDistancePerFrame / distance * difference.y);
		viewCenter = new Point(viewCenter.x + offset.x, viewCenter.y + offset.y);
	}
}

function createNewRays() {
	for (var i = 0; i < numRaysPerFrame; i++) {
		var ray = new Ray(randomRayLength(), randomAngle());
		rays.push(ray);
	}
}

function updateRays() {
	var raysNext = [];
	for (var i = 0, l = rays.length; i < l; i++) {
		if (rays[i].isVisible()) {
			rays[i].iterate();
			raysNext.push(rays[i]);
		} else {
			rays[i].delete();
		}
	}
	rays = raysNext;
}

function randomRayLength() {
	return Math.random() * (rayMaxLength - rayMinLength) + rayMinLength;
}

function randomAngle() {
	return Math.PI * 2 * Math.random();
}

