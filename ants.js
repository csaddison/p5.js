/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

_                       _              _                      _       
| |                     | |            ( )         /\         | |      
| |     __ _ _ __   __ _| |_ ___  _ __ |/ ___     /  \   _ __ | |_ ___ 
| |    / _` | '_ \ / _` | __/ _ \| '_ \  / __|   / /\ \ | '_ \| __/ __|
| |___| (_| | | | | (_| | || (_) | | | | \__ \  / ____ \| | | | |_\__ \
|______\__,_|_| |_|\__, |\__\___/|_| |_| |___/ /_/    \_|_| |_|\__|___/
                    __/ |                                              
                   |___/                                               


11.11.19

*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Cool rules
let triRule = 'RRLLLRLLLRRR';
let squareRule = 'LRRRRRLLR';
let langtonRule = 'LR';


// Initialize variables
let columns = 200;
    rows = 140;
let canvasWidth = 1200;
let fr = 60;
let simIsRunning = true;
let bg = 15;
let drawGrid = true;
let gridColor = 25;




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Pop-up input box for rules and number of ants
let numAnts = parseInt(
    prompt(
        'Enter number of ants:',
        '1'
    )
)


// Finds and separates rules
let ruleInput = prompt(
    "Enter rules for as many ants as you'd like. Separate rules using commas.\nEx: LRL, RLL, RLLLR",
    'LR'
)
let rules = ruleInput.split(', ')




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Grid class
class Grid {

    constructor(columns, rows, aspectWidth) {

        this.columns = columns;
        this.rows = rows;
        this.aspectWidth = aspectWidth
        this.gridSpacing = aspectWidth / columns;
        this.aspectHeight = this.rows * this.gridSpacing;
        this.grid = [];

    }

    // Draws grid lines over whole canvas
    drawGrid(color) {

        stroke(color);
        strokeWeight(.5);

        for (var i = 0; i <= this.aspectWidth; i += this.gridSpacing) {
            line(i, 0, i, this.aspectHeight);
        }
        for (var j = 0; j <= this.aspectHeight; j += this.gridSpacing) {
            line(0, j, this.aspectWidth, j);
        }

    }

    // Fills grid cells given an instance to fill with
    fillGrid(object) {

        for (var column = 0; column < this.columns; column++) {

            let thisColumn = [];
            for (var row = 0; row < this.rows; row++) {

                let filledGrid = new object(column, row, this.gridSpacing);
                thisColumn[row] = filledGrid;

            }

            this.grid[column] = thisColumn;

        }
    }

    // Push to list
    pushToList(list) {

        for (var column = 0; column < columns; column++) {
            for (var row = 0; row < rows; row++) {
                list.push(this.grid[column][row]);
            }
        }

    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Cell class
class Cell {

    constructor(column, row, size) {

        this.column = column;
        this.row = row;
        this.state = 0;
        this.position = [column, row];
        this.size = size;

    }

    // Changes cell state
    setState(state) {

        this.state = state;

    }

    // Draws cell given rule color
    drawIfActive(ruleSet) {

        for (var rule=1; rule < ruleSet.length; rule++) {

            if (this.state == rule) {

                let c = color(ruleSet[rule][1][0], ruleSet[rule][1][1], ruleSet[rule][1][2])
                fill(c);
                rect(this.column * this.size, this.row * this.size, this.size, this.size);

            }
        }
    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Ant class
class Ant {

    constructor(column, row) {

        this.column = column;
        this.row = row;
        this.position = [column, row];
        this.orientation = 1; // Pointing up

    }

    // Follows normal rotational direction (0* = right, 90* = up, ect: 0=r, 1=u, 2=l, 3=d)
    setOrientation(orientation) {

        this.orientation = orientation;

    }

    // For changing orientation (LEFT)
    turnLeft() {

        if (this.orientation == 3) {
            this.orientation = 0;
        } else {
            this.orientation += 1;
        }

    }

    // For changing orientation (Right)
    turnRight() {

        if (this.orientation == 0) {
            this.orientation = 3;
        } else {
            this.orientation -= 1;
        }

    }

    // Changes the state of the cell it is on 
    changeState(cell, ruleSet) {

        for (var rule=0; rule < ruleSet.length; rule++) {

            if (cell.state == rule) {

                if (ruleSet[rule][0] == 'L') {
                    this.turnLeft();
                } else if (ruleSet[rule][0] == 'R') {
                    this.turnRight();
                }

                if (rule == ruleSet.length - 1) {
                    cell.setState(0);
                } else {
                    cell.setState(rule + 1);
                }

                break;

            }
        }
    }

    // Moves ant for given orientation
    moveAnt() {

        if (this.orientation == 0) {
            this.column -= 1
        } else if (this.orientation == 1) {
            this.row -= 1
        } else if (this.orientation == 2) {
            this.column += 1
        } else if (this.orientation == 3) {
            this.row += 1
        }

    }

    // Draws red square on ant
    drawAnt(size) {

        fill('red');
        rect(this.column * size, this.row * size, size, size);

    }

    // Checks for collision with boundary
    checkBoundaries(grid) {

        if (this.column < 0 || this.column >= grid.columns) {
            console.log('stop: columns');
            simIsRunning = false;
        }

        if (this.row < 0 || this.row >= grid.rows) {
            console.log('stop: rows');
            simIsRunning = false;
        }

    }
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Setup variables
let grid = new Grid(columns, rows, canvasWidth);
let gridSize = grid.gridSpacing;
let gridElements = [];
let ants = [];
let ruleSetColor;


// Creates a number of ants
function createAnts() {

    for (var i=0; i < numAnts; i++) {
        ants[i] = new Ant(
            Math.floor(
                ((i + 1) * columns) / (numAnts + 1)
                ),
            Math.floor(
                (rows / 6) + ((2 * rows / 3) * Math.random())
                )
            )
    }

}


// Creates rule object
function createRules(rule) {

    let ruleSet = [];
    for (letter of rule) {
        let cellColor = [
            100 * Math.random() + 155,
            155 * Math.random() + 50,
            155 * Math.random() + 0
        ]
        ruleSet.push([letter, cellColor])
    }

    ruleSet[0][1] = [bg, bg, bg]; // Sets first rule to background color

    return ruleSet;

}


// Colors using the longest ruleset to encapsulate all colors
function findLongestRule() {

    let longestRuleLength = 0;
    let longestRule;

    for (rule of rules) {
        if (rule.length > longestRuleLength) {
            longestRule = rule;
        }
    }

    return createRules(longestRule);

}

function simulateAnts() {

    for (var i=0; i < numAnts; i++) {
        let ant = ants[i];
        let ruleSet;
        ant.drawAnt(gridSize);
        if (simIsRunning) {
            let antCell = grid.grid[ant.column][ant.row];

            if (rules[i]) {
                ruleSet = createRules(rules[i]);
                ant.changeState(antCell, ruleSet);
            } else {
                ruleSet = createRules('LR');
                ant.changeState(antCell, ruleSet);
            }

            ant.moveAnt();
            ant.checkBoundaries(grid);
        }
    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Processing setup loop
function setup() {

    createCanvas(canvasWidth, gridSize * rows);
    frameRate(fr);
    grid.fillGrid(Cell);
    grid.pushToList(gridElements);
    createAnts();
    ruleSetColor = findLongestRule();

}


// Draw loop
function draw() {

    background(bg);
    if (drawGrid == true) {
        grid.drawGrid(gridColor);
    }

    for (cell of gridElements) {
        cell.drawIfActive(ruleSetColor);
    }

    simulateAnts();

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Keyboard interaction
function keyPressed() {

    // Pauses sim
    if (keyCode == SHIFT) {

        if (simIsRunning) {
            simIsRunning = false    // Pausing sim
        } else {
            simIsRunning = true     // Unpausing sim
        }

    }

    // Resets grid
    if (keyCode == CONTROL) {
        location.reload();
    }

}
