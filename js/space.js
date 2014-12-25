// ---------------------------------------------------
//  Constants 
// ---------------------------------------------------
var scopeRadius = 125;

var rayColor = 'white';
var rayWidth = 2;
var rayMinLength = 30;
var rayMaxLength = 70;

var rayDistancePerFrame = 15; 
var numRaysPerFrame = 8;

// ---------------------------------------------------
//  Ray 
// ---------------------------------------------------
var Ray = function(length, angle) {
	this.length = length;
	this.angle = angle;
	this.offset = new Point(rayDistancePerFrame * Math.cos(angle), rayDistancePerFrame * Math.sin(angle));
	var from = new Point(view.center.x + scopeRadius * Math.cos(angle), view.center.y + scopeRadius * Math.sin(angle));
	var to = new Point(view.center.x + (scopeRadius + length) * Math.cos(angle), view.center.y + (scopeRadius + length) * Math.sin(angle));
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
//  Code
// ---------------------------------------------------
var rays = [];
var viewCenter = view.center;
function onResize(event) {

}

function onFrame() {
	for (var i = 0; i < numRaysPerFrame; i++) {
		var ray = new Ray(randomRayLength(), randomAngle());
		rays.push(ray);
	}

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

// ---------------------------------------------------
//  Helpers
// ---------------------------------------------------
function randomRayLength() {
	return Math.random() * (rayMaxLength - rayMinLength) + rayMinLength;
}

function randomAngle() {
	return Math.PI * 2 * Math.random();
}

