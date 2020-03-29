//
// 11.17.19
// Random Walk Agents
//

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let img;
function preload() {
    img = loadImage('images/brownie.png');
}

// Basic brownian motion agent
class Agent {

    constructor(posX, posY) {
        this.position = [posX, posY];
        this.size = 7;
        this.stepSize = 3;
        this.direction = [];
    }

    // Sets visual size
    setSize(size) {
        this.size = size;
    }

    // Sets step size, controlling speed and eating radius
    setStepSize(stepSize) {
        this.stepSize = stepSize;
    }

    // Two mathematical helper functions
    addVectors(vec1, vec2) {
        return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
    }
    subtractVectors(vec1, vec2) {
        return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
    }

    // Controls movement of agent
    stepAgent() {
        let r = Math.random() * 2 * Math.PI;
        this.direction = [
            this.stepSize * Math.cos(r),
            this.stepSize * Math.sin(r)
        ]
        this.position = this.addVectors(this.position, this.direction);
    }

    // Draws agent
    drawAgent(color) {
        noStroke();
        fill(color);
        // circle(this.position[0], this.position[1], this.size);
        image(img, this.position[0], this.position[1])
    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class Histogram {

    constructor(bins) {
        this.numBins = bins;
        this.width = 100;
        this.height = 100;
        this.border = 10;
        this.hasTicks = true;
        this.bins = [];
        // Empty bins
        for (var i=0; i < this.numBins; i++) {
            this.bins[i] = 0;
        }
    }

    positionFigure(width, height, left, bottom) {
        this.width = width;
        this.height = height;
        this.leftSide = left;
        this.baseLine = bottom;
        this.binEdges = [left];
        // Bin edges
        for (var i=1; i < this.numBins; i++) {
            let widthRatio = i / this.numBins;
            let binEdge = this.width * widthRatio;
            this.binEdges.push(binEdge);
        }
        this.binEdges.push(left + width);
    }

    normalize(maximum) {
        this.maximum = maximum;
    }

    drawGrid() {
        stroke(255);

        let left = this.leftSide;
        let right = this.leftSide + this.width;
        let bottom;
        if (this.hasTicks) {

            bottom = this.baseLine - this.border;
            line(left, bottom, right, bottom);

            for (var edge of this.binEdges) {
                line(edge, this.baseLine, edge, this.baseLine - this.border);
            }

        } else {
            bottom = this.baseLine;
            line(left, bottom, right, bottom);
        }
    }

    binData(agents) {
        // Empty bins
        for (var i=0; i < this.numBins; i++) {
            this.bins[i] = 0;
        }
        for (var agent of agents) {
            for (var i=0; i < this.numBins; i++) {
                if (agent.position[0] > this.binEdges[i] && agent.position[0] < this.binEdges[i+1]) {
                    this.bins[i] += 1;
                }
            }
        }
    }

    drawBins() {
        noStroke();
        fill(255);
        for (var i=0; i < this.numBins; i++) {
            let binHeight = this.height * this.bins[i] / this.maximum;
            let left = this.binEdges[i];
            let binWidth = this.width / this.numBins;
            rect(left, this.baseLine - (this.border + binHeight), binWidth, binHeight);
        }
    }
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Initialize variables
let w = 500;
    h = 800;
let fr = 10;
let numAgents = 1500;
let agents = [];
let bins = 90;
let hist = new Histogram(bins);
let size = 20;
    speed = 5;



// Setup function
function setup() {
    createCanvas(w, h);
    frameRate(fr);
    img.resize(size, size)
    for (var i=0; i < numAgents; i++) {
        agents[i] = new Agent(w/2, 250);
        agents[i].size = size;
        agents[i].stepSize = speed;
    }
    hist.positionFigure(w, h, 0, h - 5);
    hist.normalize(numAgents);
}

// Draw loop
function draw() {
    background('#4d0013');
    for (var i=0; i < agents.length; i++) {
        let agent = agents[i];
        let c = color(i*200/numAgents, 255/(i+1), 255);
        agent.stepAgent();
        agent.drawAgent(c);
    }

    hist.drawGrid();
    hist.binData(agents);
    hist.drawBins();
}