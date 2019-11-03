

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
        circle(this.position[0], this.position[1], this.size);
    }

}




