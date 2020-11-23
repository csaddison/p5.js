//
// Better Boids
// 07.06.2020
//


///////////////////////////////////////////////////////////////////////////////

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

// Matrix rotation of 2-dimensional vectors in degrees
function rotateVector(vec, angle, isDegree = false) {
    var theta;
    if (isDegree) {
        theta = angle * Math.PI / 180;
    } else {
        theta = angle;
    }
    
    let x = Math.cos(theta) * vec[0] - Math.sin(theta) * vec[1];
    let y = Math.sin(theta) * vec[0] + Math.cos(theta) * vec[1];
    return [x, y];
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

///////////////////////////////////////////////////////////////////////////////

// Global boid variables
// let initialSpeed = 2.5

// Boid class
class Boid {

    constructor(x, y) {

        var initialSpeed = 5;
        
        this.position = {x: x, y: y};

        this.velocity = {
            x: initialSpeed * (2 * Math.random() - 1),
            y: initialSpeed * (2 * Math.random() - 1)
        };

        this.size = 10;
        this.sense = 100;
    };

    getOrientation() {
        this.orientation = Math.atan(this.velocity.y / this.velocity.x) + Math.PI/2;
        if (this.velocity.x < 0 || this.velocity < 0) {
            this.orientation += Math.PI;
        }
        // console.log(this.orientation);
    }

    draw() {
        // circle(this.position.x, this.position.y, 10)

        let v1 = [-this.size / 2, this.size];
        let v2 = [0, -this.size];
        let v3 = [this.size / 2, this.size];
        v1 = addVectors(rotateVector(v1, this.orientation), [this.position.x, this.position.y]);
        v2 = addVectors(rotateVector(v2, this.orientation), [this.position.x, this.position.y]);
        v3 = addVectors(rotateVector(v3, this.orientation), [this.position.x, this.position.y]);
        triangle(v1[0], v1[1], v2[0], v2[1], v3[0], v3[1]);
    };

    loopBoundaries(canvasWidth, canvasHeight) {
        if (this.position.x < 0) {
            this.position.x = canvasWidth;
        } else if (this.position.x > canvasWidth) {
            this.position.x = 0;
        }
        
        if (this.position.y < 0) {
            this.position.y = canvasHeight;
        } else if (this.position.y > canvasHeight) {
            this.position.y = 0;
        }
    }

    findNeighbors(flock) {
        this.neighbors = [];
        for (var bird of flock) {
            let distance = subVectors([bird.position.x, bird.position.y], [this.position.x, this.position.y]);
            if (getMagnitude(distance) <= this.sense && getMagnitude(distance) > 0) {
                this.neighbors.push(bird)
            };
        };
    };

    resetAcceleration() {
        this.acceleration = {
            x: 0,
            y: 0
        }
    }
    separate() {

        var seperationFactor = .02;
        this.separation = 20;

        this.dvSep = [0, 0];
        for (var neighbor of this.neighbors) {
            if (getMagnitude(subVectors([this.position.x, this.position.y], [neighbor.position.x, neighbor.position.y])) < this.separation) {
                this.dvSep = subVectors(this.dvSep, subVectors([this.position.x, this.position.y], [neighbor.position.x, neighbor.position.y]));
            };
        };

        this.acceleration.x -= this.dvSep[0] * seperationFactor;
        this.acceleration.y -= this.dvSep[1] * seperationFactor;
    };

    cohere() {

        var coherenceFactor = .01;
        this.centerOfMass = [0, 0];

        for (var neighbor of this.neighbors) {
            this.centerOfMass = [this.centerOfMass[0] + neighbor.position.x, this.centerOfMass[1] + neighbor.position.y];
        };

        if (this.neighbors.length > 0) {
            this.centerOfMass = [this.centerOfMass[0] / this.neighbors.length, this.centerOfMass[1] / this.neighbors.length];
            this.dvCoM = [this.position.x - this.centerOfMass[0], this.position.y - this.centerOfMass[1]];

            this.acceleration.x += this.dvCoM[0] * coherenceFactor;
            this.acceleration.y += this.dvCoM[1] * coherenceFactor;
        };
    };

    align(){

        var alignmentFactor = .05;
        this.averageVelocity = [0,0];

        for (var neighbor of this.neighbors) {
            this.averageVelocity = [this.averageVelocity[0] + neighbor.velocity.x, this.averageVelocity[1] + neighbor.velocity.y];
        };

        if (this.neighbors.length > 0) {
            this.averageVelocity = [this.averageVelocity[0] / this.neighbors.length, this.averageVelocity[1] / this.neighbors.length];
            
            this.acceleration.x += this.averageVelocity[0] * alignmentFactor;
            this.acceleration.y += this.averageVelocity[1] * alignmentFactor;
        };
    };

    limitSpeed() {
        this.maxSpeed = 10;
        this.speedFactor = .9;

        if (getMagnitude([this.velocity.x, this.velocity.y]) > this.maxSpeed) {
            this.velocity.x = this.speedFactor * this.velocity.x;
            this.velocity.y = this.speedFactor * this.velocity.y;
        };
    };

    limitAcceleration() {
        this.accelerationSpeed = .1;
        this.accelerationFactor = .8;
        this.maxAccel = this.accelerationSpeed * getMagnitude([this.velocity.x, this.velocity.y]);

        if (getMagnitude([this.acceleration.x, this.acceleration.y]) > this.maxAccel) {
            this.acceleration.x = this.accelerationFactor * this.acceleration.x;
            this.acceleration.y = this.accelerationFactor * this.acceleration.y;
        };
    }

    avoidBoundaries(canvasWidth, canvasHeight) {

        var margin = .25;
        this.reboundForce = .005;
        
        if (this.position.x < margin * canvasWidth) {
            this.acceleration.x += this.reboundForce * ((margin * canvasWidth) - this.position.x);
        } else if (this.position.x > (1-margin) * canvasWidth) {
            this.acceleration.x -= this.reboundForce * (this.position.x - ((1-margin) * canvasWidth));
        };
        
        if (this.position.y < margin * canvasHeight) {
            this.acceleration.y += this.reboundForce * ((margin * canvasHeight) - this.position.y);
        } else if (this.position.y > (1-margin) * canvasHeight) {
            this.acceleration.y -= this.reboundForce * (this.position.y - ((1-margin) * canvasHeight));;
        };
    };

    move() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
};


///////////////////////////////////////////////////////////////////////////////

// Initialize variables
let w = .95 * window.innerWidth;
    h = .9 * window.innerHeight;
let N = 300;
let fps = 30;
let flock = [];
let isInfinite = false;

// Setup function
function setup() {
    createCanvas(w, h);
    frameRate(fps);

    for (var i=0; i < N; i++) {
        flock[i] = new Boid(Math.random() * w, Math.random() * h);
    };
}

// Draw loop
function draw() {
    background(2);
    noStroke();

    for (boid of flock) {

        boid.getOrientation();

        if (boid === flock[0]) {
            fill('orange')
        } else {
            fill('steelblue')
        }

        boid.draw();
        boid.resetAcceleration();
        boid.findNeighbors(flock);

        boid.separate();
        boid.cohere();
        boid.align();

        if (isInfinite) {
            boid.limitAcceleration();
            boid.move();
            boid.limitSpeed();
            boid.loopBoundaries(w, h);
        } else {
            boid.avoidBoundaries(w,h);
            boid.limitAcceleration();
            boid.move();
            boid.limitSpeed();
        };
    };
};