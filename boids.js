//
// 10.28.19
// Boids Boi
//

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Vector addition for any number of vectors of any dimension
function addVectors() {
    let vector = [];
    for (var vec of arguments) {
        for (var elem = 0; elem < vec.length; elem++) {
            if (isNaN(vector[elem])) {
                vector[elem] = vec[elem];
            } else {
                vector[elem] += vec[elem];
            }
        }
    }
    return vector;
}

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

// Scalar dot-product for two vectors of any dimension
function dotVectors(vec1, vec2) {
    let dot = 0;
    for (var elem = 0; elem < vec1.length; elem++) {
        dot += vec1[elem] * vec2[elem];
    }
    return dot;
}

// Vector cross-product two 3-dimensional vectors
function crossVectors(vec1, vec2) {
    let vector = [];
        a = vec1;
        b = vec2;
    vector[0] = a[1] * b[2] - a[2] * b[1];
    vector[1] = a[2] * b[0] - a[0] * b[2];
    vector[2] = a[0] * b[1] - a[1] * b[0];
    return vector;
}

// Scalar magnitude of arbitrary dimensional vector
function getMagnitude(vec) {
    let magnitude = 0;
    for (var elem of vec) {
        magnitude += elem ** 2;
    }
    magnitude = Math.sqrt(magnitude);
    return magnitude;
}

// Matrix rotation of 2-dimensional vectors in degrees
function rotateVector(vec, angle) {
    let theta = angle * Math.PI / 180;
    let x = Math.cos(theta) * vec[0] - Math.sin(theta) * vec[1];
    let y = Math.sin(theta) * vec[0] + Math.cos(theta) * vec[1];
    return [x, y];
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Boid class
class Boid {

    constructor() {
        this.size = 8;
        this.position = [];
        this.velocity = [];
        this.orientation = 0; // Range from -180 to 180
        this.radius = 100;
        this.speed = 3;
        this.avoidance = 1;
        this.alignment = 1;
        this.cohesion = 1;
        this.color = 'DodgerBlue'
    }

    initialize(canvasWidth, canvasHeight) {
        this.position = [Math.random() * canvasWidth, Math.random() * canvasHeight];
        this.orientation = (Math.random() * 360) - 180;
        this.velocity = [Math.sin(this.orientation * Math.PI / 180) * this.speed, -Math.cos(this.orientation * Math.PI / 180) * this.speed];
    }

    findNeighbors(flock) {
        this.neighbors = [];
        for (var bird of flock) {
            let distance = subVectors(bird.position, this.position);
            if (getMagnitude(distance) <= this.radius && getMagnitude(distance) > 0) {
                this.neighbors.push(bird)
            }
        }
    }

    draw() {
        strokeWeight(0);
        stroke(255);
        fill(this.color);

        let v1 = [-this.size / 2, this.size];
        let v2 = [0, -this.size];
        let v3 = [this.size / 2, this.size];
        v1 = addVectors(rotateVector(v1, this.orientation), this.position);
        v2 = addVectors(rotateVector(v2, this.orientation), this.position);
        v3 = addVectors(rotateVector(v3, this.orientation), this.position);

        triangle(v1[0], v1[1], v2[0], v2[1], v3[0], v3[1]);
    }

    move() {
        this.position = addVectors(this.position, this.velocity);
    }

    loopBoundaries(canvasWidth, canvasHeight) {
        if (this.position[0] < 0) {
            this.position[0] = canvasWidth;
        } else if (this.position[0] > canvasWidth) {
            this.position[0] = 0;
        }
        
        if (this.position[1] < 0) {
            this.position[1] = canvasHeight;
        } else if (this.position[1] > canvasHeight) {
            this.position[1] = 0;
        }
    }

    separate() {

    }

    align() {
        this.alignRatio = .1

        let groupVelocity = [0, 0];
        for (boid of this.neighbors) {
            groupVelocity = addVectors(groupVelocity, boid.velocity);
        }
        for (var elem of groupVelocity) {
            elem /= this.neighbors.length;
        }

        this.velocity = addVectors(this.velocity, groupVelocity * this.alignRatio);
        for (var elem of this.velocity) {
            elem = elem / getMagnitude(this.velocity) * this.speed;
        }
    }

    flock() {

    }


}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Initialize variables
let w = 500;
    h = 500;
let N = 10;
let fr = 10;
let flock = [];

// Setup function
function setup() {
    createCanvas(w, h);
    frameRate(fr);

    for (var i=0; i < N; i++) {
        flock[i] = new Boid();
        flock[i].initialize(w, h);
    }

    flock[0].color = 'orange'

}

// Draw loop
function draw() {
    background(15);

    for (boid of flock) {
        boid.draw();

        boid.findNeighbors(flock);
        boid.align();

        boid.move();
        boid.loopBoundaries(w, h);
    }

    noFill();
    strokeWeight(1);
    circle(flock[0].position[0], flock[0].position[1], flock[0].radius * 2);

    flock[0].findNeighbors(flock);
    console.log(flock[0].neighbors)

}