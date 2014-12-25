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

Ray.prototype = {
	iterate: function() {
		this.line.translate(this.offset);	
	},

	isVisible: function() {
		return (view.bounds.contains(this.line.getPointAt(0)));
	},

	delete: function() {
		this.line.remove();
	}
}

// ---------------------------------------------------
//  Laser
// ---------------------------------------------------
var rightLaserStart = view.center;
var leftLaserStart = view.center;

var Laser = function(destination) {
	this.updateLaserStartPoints();

	this.destinationLeft = new Point(destination.x - view.size.width / 30, destination.y);
	this.destinationRight = new Point(destination.x + view.size.width / 30, destination.y);

	this.beamLeft = new Beam(leftLaserStart, this.destinationLeft);
	this.beamRight = new Beam(rightLaserStart, this.destinationRight);
}

Laser.prototype = {
	iterate: function() {
		this.beamLeft.iterate();
		this.beamRight.iterate();
	},

	updateLaserStartPoints: function() {
		rightLaserStart = new Point(view.center.x + view.size.width / 6, view.center.y + view.size.height / 3);
		leftLaserStart = new Point(view.center.x - view.size.width / 6, view.center.y + view.size.height / 3);
	},

	isVisible: function() {
		return !(this.beamRight.endReached() && this.beamLeft.endReached());
	},

	delete: function() {
		this.beamLeft.delete();
		this.beamRight.delete();
	}

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

Beam.prototype = {
	endReached: function() {
		return (this.line.strokeWidth <= 0);
	},

	iterate: function() {
		this.line.translate(this.offset);
		this.line.strokeWidth = this.line.strokeWidth - (beamStartWidth - beamEndWidth) / beamNumFrames;	
	},

	delete: function() {
		this.line.remove();
	}
}

// ---------------------------------------------------
//  Asteroid
// ---------------------------------------------------
var asteroidMaxStartRadius = 20;
var asteroidMinStartRadius = 5;
var asteroidColor = '#a67d3d';
var asteroidOpacity = 0.7;
var asteroidMinNumFrames = 40;
var asteroidMaxNumFrames = 120;
var asteroidEndScale = 5;

var Asteroid = function(origin, radius, numFrames) {
	this.endRadius = asteroidEndScale * radius;
	this.currentRadius = radius;
	this.stepScale = Math.pow(asteroidEndScale, 1 / numFrames);
	this.shape = new Path.Circle(origin, radius);
	this.shape.fillColor = asteroidColor;
	this.shape.strokeColor = asteroidColor
	this.shape.opacity = asteroidOpacity;
}

Asteroid.prototype = {
	isVisible: function() {
		return this.currentRadius <= this.endRadius;
	},

	iterate: function() {
		this.currentRadius = this.currentRadius * this.stepScale;
		this.shape.scale(this.stepScale);
	},

	delete: function() {
		this.shape.remove();
	},

	explode: function() {
		console.log("exploded");
		this.delete();
	},

	collides: function(laser) {
		return (this.shape.contains(laser.beamLeft.line.getPointAt(laser.beamLeft.line.length)) ||
			this.shape.contains(laser.beamRight.line.getPointAt(laser.beamRight.line.length)));
	}
}

// ---------------------------------------------------
//  Initializations
// ---------------------------------------------------
var rays = [];
var scopeCenter = view.center;
var goalViewCenter = view.center;
var lasers = [];
var asteroids = [];
var asteroidProbability = 0;

// ---------------------------------------------------
//  Events
// ---------------------------------------------------
function onFrame() {
	checkLaserAsteroidCollisions();
	updateAsteroidProbability();
	createAsteroids();
	updateScope();
	for (var i = 0; i < numRaysPerFrame; i++) {
		createRandomRay();
	}
	updateRays();
	updateLasers();
	updateAsteroids();
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
function checkLaserAsteroidCollisions() {
	asteroidsNext = [];
	for (var i = 0; i < asteroids.length; i++) {
		if (lasers[0]) {
			if (asteroids[i].collides(lasers[0])) {
				asteroids[i].explode();
				lasers[0].delete();
				lasers.splice(0,1);
				asteroids.splice(i, 1);
			}
		}
	}
}

function updateAsteroidProbability() {
	asteroidProbability = asteroidProbability + .001;
}

function createAsteroids() {
	if (Math.random() < asteroidProbability) {
		var origin = new Point(randomNumInRange(view.center.x - view.size.width / 3, view.center.x + view.size.width / 3), 
			randomNumInRange(view.center.y - view.size.height / 3, view.center.y + view.size.height / 3));
		var asteroid = new Asteroid(
			origin, 
			randomNumInRange(asteroidMinStartRadius, asteroidMaxStartRadius), 
			randomNumInRange(asteroidMinNumFrames, asteroidMaxNumFrames)
			);
		asteroids.push(asteroid);
		asteroidProbability = -.05;
	}
}

function updateAsteroids() {
	var asteroidsNext = [];
	for (var i = 0, l = asteroids.length; i < l; i++) {
		if (asteroids[i].isVisible()) {
			asteroids[i].iterate();
			asteroidsNext.push(asteroids[i]);
		} else {
			asteroids[i].delete();
		}
	}
	asteroids = asteroidsNext;
}

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

function createRandomRay() {
	var ray = new Ray(randomNumInRange(rayMinLength, rayMaxLength), randomAngle());
	rays.push(ray);
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

// ---------------------------------------------------
//  Math Helpers
// ---------------------------------------------------
function randomAngle() {
	return Math.random() * 2 * Math.PI;
}

function randomNumInRange(min, max) {
	return min + (max - min) * Math.random();
}
