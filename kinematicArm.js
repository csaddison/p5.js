//
// Kinematic Arm
// 4/7/20
//
//////////////////////////////////////////////////////////////////////////

// Initialize variables
let w = 800;
    h = 800;
let fr = 10;
let segments = [];
let numSegments = 2;
let drawTrigIsOn = true;
let target;


//////////////////////////////////////////////////////////////////////////

// Arm segment class. Each arm inherits the position and orientation of its parent
class Segment {
    constructor(parent, length) {
        this.parent = parent;
        this.length = length;
        this.relativeAngle = 0;
    }

    getPosition() {
        console.log()
        this.angle = this.parent.angle + this.relativeAngle;
        this.start = this.parent.end;
        this.end = [
            this.start[0] + (Math.cos( (this.angle + 90) * Math.PI / 180) * this.length),
            this.start[1] + (Math.sin( (this.angle + 90) * Math.PI / 180) * this.length)
        ];
    }

    drawSegment(screenHeight) {
        line(
            this.start[0],
            screenHeight - this.start[1],
            this.end[0],
            screenHeight - this.end[1]
        );
    }
}

// Stationary base class
class Base {
    constructor(posX, posY, width) {
        this.endLeft = posX - width/2;
        this.endRight = posX + width/2;
        this.height = posY;
        this.end = [posX, posY];
        this.relativeAngle = 0;
        this.angle = 0
    }

    getPosition() {
        this.relativeAngle = 0;
    }

    drawSegment(screenHeight) {
        line(
            this.endLeft,
            screenHeight - this.height,
            this.endRight,
            screenHeight - this.height
        )
    }
}


//////////////////////////////////////////////////////////////////////////

// Creates the segments
function addSegments() {
    segments[0] = new Base(w/2, 150, 200);
    for (var i=1; i < numSegments + 1; i++) {
        segments[i] = new Segment(segments[i-1], 150);
        segments[i].getPosition();
    }
}

// Finds intersection of segment circles
function findIntersection(parent, child) {
    let d = Math.sqrt((child.end[0] - parent.start[0])**2 + (child.end[1] - parent.start[1])**2);
    let r1 = parent.length;
    let r2 = child.length;
    let x = (d**2 - r2**2 + r1**2) / (2 * d)
    let y = Math.sqrt(r1**2 - x**2);
    return [x, y];
}

// Sets target angle of each segment
function updateAngleX(segment) {
    segment.relativeAngle = (((w - mouseX) / w) * 120) - 60
}
function updateAngleY(segment) {
    segment.relativeAngle = (((h - mouseY) / h) * 360) - 180
}

// Scalar dot-product for two vectors of any dimension
function dotVectors(vec1, vec2) {
    let dot = 0;
    for (var elem = 0; elem < vec1.length; elem++) {
        dot += vec1[elem] * vec2[elem];
    }
    return dot;
}


//////////////////////////////////////////////////////////////////////////

// Draw loops
function setup() {
    createCanvas(w, h);
    frameRate(fr);

    addSegments();
    segments[2].length = 200;
}

function draw() {
    background(0, 5, 0);
    stroke(255);
    target = [mouseX, mouseY];

    for (segment of segments) {
        if (segment === segments[1]) {
            updateAngleX(segment)
        } else if (segment === segments[2]) {
            updateAngleY(segment)
        }
        segment.getPosition();
        segment.drawSegment(h);
    }

    // Drawing triginometry
    if (drawTrigIsOn) {
        noFill();
        stroke(100, 150, 100);
        circle(segments[1].start[0], h - segments[1].start[1], 2 * segments[1].length);
        circle(segments[2].end[0], h - segments[2].end[1], 2 * segments[2].length);
        stroke(255,50,0)
        circle(segments[1].start[0], h - segments[1].start[1], (2 * segments[1].length) + (2 * segments[2].length))
    }

    // Finding and drawing intersecting points
    let intersection = findIntersection(segments[1], segments[2])
    console.log(intersection)
    let angleDifference;
    fill(100, 150, 100);
    noStroke();
    circle(intersection[0], intersection[1], 15)

    // Drawing target
    noStroke();
    fill(0, 255, 0)
    circle(target[0], target[1], 15)
}