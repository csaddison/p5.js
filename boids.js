//
// 10.28.19
// Boids Boi
//

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Importing helper functions
import {addVectors, subVectors, dotVectors, crossVectors, getMagnitude} from 'vectors.js';

// Boid class
class Boid {

    constructor() {
        this.size = 10;
        this.position = [];
        this.velocity = [];
        this.orientation = 0 //Math.random() * 360;
        this.radius = 30;
        this.speed = 3;
        this.avoidance = 1;
        this.alignment = 1;
        this.cohesion = 1;
        this.color = 'DodgerBlue'
    }

    setColor(color) {
        this.color = color;
    }

    findNeighbors(flock) {
        this.neighbors = [];
        for (var bird of flock) {
            let distance = bird.position - this.position;
            if (getMagnitude(distance) <= this.radius) {
                this.neighbors.push(bird)
            }
        }
    }


}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Initialize variables
let w = 500;
    h = 500;
let N = 1;
let fr = 60;

// Setup function
function setup() {
    createCanvas(w, h);
    frameRate(fr);
}

// Draw loop
function draw() {
    background(15);
    fill('red')
    triangle(50,50, 60,60, 70,70);
}