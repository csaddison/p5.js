//
// Voronoi Map
// 3/28/20
//
//////////////////////////////////////////////////////////////////////////

// Initialize variables
let w = 1200;
    h = 800;
let numPoints = 10;
let pointSize = 5;
let pointList = [];

// Point class
class Point {
    constructor(posX, posY) {
        this.location = [posX, posY];
    }
}

// Making random points
function makePoints(number, canvasSize) {
    let points = [];
    for (var i=0; i < number; i++) {
        points.push(
            new Point(
                Math.random() * canvasSize[0],
                Math.random() * canvasSize[1]
            )
        )
    }
    return points;
}

// Drawing each seed
function drawPoints(points) {
    for (point of points) {
        circle(point.location[0], point.location[1], pointSize)
    }
}



//////////////////////////////////////////////////////////////////////////

// Vector subtraction for any number of vectors of any dimension
function subVectors() {
    let vector = [];
    for (var vec of arguments) {
        for (var elem = 0; elem < vec.length; elem++) {
            if (isNaN(vector[elem])) {
                vector[elem] = vec[elem];
            } else {
                vector[elem] -= vec[elem];
            }
        }
    }
    return vector;
}

// Returns pythagorean length of n-dimensional vector
function getMagnitude(vec) {
    let magnitude = 0;
    for (var elem of vec) {
        magnitude += elem ** 2;
    }
    magnitude = Math.sqrt(magnitude);
    return magnitude;
}



//////////////////////////////////////////////////////////////////////////

// Voronoi function
function voronoi(points, canvasSize) {

    for (var x=0; x < canvasSize[0]; x++) {
        for (var y=0; y < canvasSize[1]; y++) {

            let minDist;
            for (point of points) {
                let dist = getMagnitude(subVectors([x,y], point.location));
                if (dist < minDist) {
                    minDist = dist;
                }
            }

        }
    }
}


//////////////////////////////////////////////////////////////////////////

// Draw loops
function setup() {
    createCanvas(1280, 720);
    stroke(255);
    pointList = makePoints(numPoints, [w,h]);
}
function draw() {
    background(5);
    drawPoints(pointList);
}