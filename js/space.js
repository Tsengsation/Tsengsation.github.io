// ---------------------------------------------------
//  Constants 
// ---------------------------------------------------
var scopeRadius = 125;
var scopeDistancePerFrame = 10;

var rayDistancePerFrame = 20; 
var numRaysPerFrame = 15;

// ---------------------------------------------------
//  Ray 
// ---------------------------------------------------
var rayColor = 'white';
var rayWidth = 2;
var rayMinLength = 30;
var rayMaxLength = 70;

var Ray = function(length, angle) {
	this.length = length;
	this.angle = angle;
	this.offset = new Point(rayDistancePerFrame * Math.cos(angle), rayDistancePerFrame * Math.sin(angle));
	var from = new Point(scopeCenter.x + scopeRadius * Math.cos(angle), scopeCenter.y + scopeRadius * Math.sin(angle));
	var to = new Point(scopeCenter.x + (scopeRadius + length) * Math.cos(angle), scopeCenter.y + (scopeRadius + length) * Math.sin(angle));
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
//  Laser
// ---------------------------------------------------
var rightLaserStart = view.center;
var leftLaserStart = view.center;

var Laser = function(destination) {
	this.updateLaserStartPoints();

	this.destinationLeft = new Point(destination.x - view.size.width / 20, destination.y);
	this.destinationRight = new Point(destination.x + view.size.width / 20, destination.y);

	this.beamLeft = new Beam(leftLaserStart, this.destinationLeft);
	this.beamRight = new Beam(rightLaserStart, this.destinationRight);
}

Laser.prototype.iterate = function() {
	this.beamLeft.iterate();
	this.beamRight.iterate();
}

Laser.prototype.updateLaserStartPoints = function() {
	rightLaserStart = new Point(view.center.x + view.size.width / 6, view.center.y + view.size.height / 3);
	leftLaserStart = new Point(view.center.x - view.size.width / 6, view.center.y + view.size.height / 3);
}

Laser.prototype.isVisible = function() {
	return (this.beamRight.endReached && this.beamLeft.endReached);
}

// ---------------------------------------------------
//  Beam
// ---------------------------------------------------
var beamColor = 'yellow'
var beamStartWidth = 15;
var beamEndWidth = 0;
var beamNumFrames = 10;

var Beam = function(start, destination) {
	var difference = new Point(destination.x - start.x, destination.y - start.y);
	var distance = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2));
	if (distance != 0) {
		this.offset = new Point(difference.x / beamNumFrames, difference.y / beamNumFrames);
	} else {
		this.offset = new Point(0,0);
	}
	var from = start;
	var to = new Point(start.x + this.offset.x, start.y + this.offset.y);
	this.line = new Path.Line(from, to);
	this.line.strokeColor = beamColor;
	this.line.strokeWidth = beamStartWidth;
	this.line.strokeCap = 'round';
}

Beam.prototype.endReached = function() {
	return (this.line.strokeWidth <= 0);
}

Beam.prototype.iterate = function() {
	this.line.translate(this.offset);
	this.line.strokeWidth = this.line.strokeWidth - (beamStartWidth - beamEndWidth) / beamNumFrames;
}

// ---------------------------------------------------
//  Initializations
// ---------------------------------------------------
var rays = [];
var scopeCenter = view.center;
var goalViewCenter = view.center;
var lasers = [];

// ---------------------------------------------------
//  Events
// ---------------------------------------------------
function onFrame() {
	updateScope();
	createNewRays();
	updateRays();
	updateLasers();
}

function onMouseMove(event) {
	goalViewCenter = event.point;
}

function onMouseUp(event) {
	shootLasers();
}

function onKeyUp(event) {
	if (event.key == 'space') {
		onMouseUp(null);
	}
}

// ---------------------------------------------------
//  Helpers
// ---------------------------------------------------
function shootLasers() {
	var laser = new Laser(scopeCenter);
	lasers.push(laser);
}

function updateLasers() {
	var lasersNext = [];
	for (var i = 0, l = lasers.length; i < l; i++) {
		if (lasers[i].isVisible()) {
			lasers[i].iterate();
			lasersNext.push(lasers[i]);
		} else {
			lasers[i].delete();
		}
	}
	lasers = lasersNext;
}

function updateScope() {
	var difference = new Point(goalViewCenter.x - scopeCenter.x, goalViewCenter.y - scopeCenter.y);
	var distance = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2));
	if (distance != 0) {
		var offset = new Point(scopeDistancePerFrame / distance * difference.x, scopeDistancePerFrame / distance * difference.y);
		scopeCenter = new Point(scopeCenter.x + offset.x, scopeCenter.y + offset.y);
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

