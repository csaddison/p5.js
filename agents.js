//
// 10.20.19
// Random Walk Agents
//

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Food class
class Food {

    constructor(posX, posY) {
        this.position = [posX, posY];
        this.value = 1;
        this.size = 3;
    }

    // Changes eaten food
    setValue(value) {
        this.value = value;
    }

    // Draws food particles
    drawFood() {
        noStroke();
        fill('lime');
        circle(this.position[0], this.position[1], this.size);
    }
    
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Animal class extension
class Animal extends Agent {

    // Sets and adds health parameter
    setHealth(health) {
        this.health = health;
    }

    // Radius at which animals will go toward food
    setSense(radius) {
        this.senseRadius = radius;
    }

    // Rate at which animals lose health
    setEnergyCost(cost) {
        this.cost = cost;
    }

    // Checks if animal has enough health to reproduce
    willReproduce(threshold) {
        if (this.health >= threshold) {
            return true;
        }
    }

    // Eats food, adds health, and empties value
    eat(food) {
        this.health += food.value;
        food.setValue(0);
    }

    // Checks if food is nearby and if they're close enough to eat
    checkForFood(foods) {
        for (var i=0; i < foods.length; i++) {
            let distance = Math.abs(super.subtractVectors(this.position, foods[i].position));
            if (distance <= this.senseRadius && distance >= 0) {
                if (distance <= this.stepSize / 2 && distance >= 0) {
                    this.eat(foods[i]);
                    this.foodIsNearby = false;
                } else {
                    this.foodIsNearby = true;
                }
            } else {
                this.foodIsNearby = false;
            }
        }
    }

    // Movement of animal changes, brownian motion vs. directly to food in sense radius
    stepAgent() {
        if (this.foodIsNearby) {
            let tempDir = super.subtractVectors(this.position, foodPositions[i]);
            let tempMag = Math.sqrt(tempDir[0]**2 + tempDir[1]**2);
            this.direction = [
                this.stepSize * tempDir[0] / tempMag,
                this.stepSize * tempDir[1] / tempMag
            ]
            this.position = this.addVectors(this.position, this.direction);
        } else {
            super.stepAgent()
            this.health -= this.cost;
        }
    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Initialize variables
let w = 500;
    h = 500;
let fr = 60;
let epochTime = fr * 60;
let numAnimals = 3;
    numFood = 20;
let animals = [];
let foods = [];
let health = 10;
let sense = 50;
let speed = 3;
let cost = .05;

// Removes empty food after each step
function removeFromList(list, index) {
    list.splice(index, 1);
}

// Setup function
function setup() {
    createCanvas(w, h);
    frameRate(fr);
    for (var i=0; i < numAnimals; i++) {
        let animal = new Animal(w/2, h/2);
        animal.setHealth(health);
        animal.setSense(sense);
        animal.setStepSize(speed);
        animal.setEnergyCost(cost);
        animals[i] = animal;
    }
    for (var j=0; j < numFood; j++) {
        foods[j] = new Food(Math.random() * w, Math.random() * h);
    }
    
}

// Draw loop
function draw() {
    background(15);
    for (var i=0; i < foods.length; i++) {
        foods[i].drawFood();
    }
    for (var i=0; i < animals.length; i++) {
        let animal = animals[i];
        animal.checkForFood(foods);
        animal.stepAgent();
        animal.drawAgent('chocolate');
    }
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*

// Initialize variables
let w = 500;
    h = 500;
let fr = 60;
let N = 100;
let agents = [];

// Setting up canvas
function setup() {
    createCanvas(w, h);
    frameRate(fr)
    for (var i=0; i < N; i++) {
        agents[i] = new Agent(w/2, h/2);
    }
}

function draw() {

    background('rgba(0,0,0, 0.1)');

    for (var i=0; i < N; i++) {
        let c = color(255, 255/(i+1), i*255/N);
        agents[i].drawAgent(c);
        agents[i].stepAgent();
    }
}

*/
