//
// 9.4.19
// Conway's Cellular Automaton (ECA)
//

/*
TODO:

*/


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Initialize variables
let columns = 100;
    rows = 60;
let canvasWidth = 1200;
let canvasHeight;

let grid = new Array();
let cellSize = canvasWidth / columns;
let fr = 10;
let simIsRunning = false;
let colorPick = 0;
let colorList = [
    'indigo',
    'yellowgreen',
    'darkred',
    'cyan',
    'coral',
    'magenta'
]

canvasHeight = rows * cellSize;




// Cell class
class Cell {

    constructor(column, row) {
        this.column = column;
        this.row = row;
        this.isActivated = false;
        this.pastState = this.isActivated;
        this.position = [column, row];
    }

    // Updates past state memory
    updateMemory() {
        this.pastState = this.isActivated;
    }

    // Changes cell state
    setState(state) {
        this.isActivated = state;
    }

    // Evolves cell state
    evolveCell() {

        let neighbors = 0;

        for (let offsetColumn = -1; offsetColumn < 2; offsetColumn++){
            for (let offsetRow = -1; offsetRow < 2; offsetRow++) {
                let nextCell = grid[this.column + offsetColumn][this.row + offsetRow];
                neighbors += nextCell.pastState;    // Counting neighbors
            }
        }

        neighbors -= this.isActivated               // Removes current cell from neighbor count

        if (neighbors == 3) {
            this.setState(true);                    // Brings cell to life
        } else if (neighbors == 2) {
            this.setState(this.isActivated);        // Stasis
        } else {
            this.setState(false);                   // Kills cell
        }

    }

    // Draws cell if active
    drawIfActive() {
        if (this.isActivated) {
            rect(this.column * cellSize, this.row * cellSize, cellSize, cellSize);
        }
    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Specific shape-drawing class
class Shape {

    constructor() {
        this.options = new Array()
        this.option = 0
        this.shapes = {

            'blinker': [[1], [1], [1]],

            'pent': [[0,1,0], [0,1,0], [1,0,1], [0,1,0], [0,1,0], [0,1,0], [0,1,0], [1,0,1], [0,1,0], [0,1,0]],

            'pulsar': [[1,1,1], [1,0,1], [1,1,1], [0,0,0], [0,0,0], [0,0,0], [1,1,1], [1,0,1], [1,1,1]],

            'herschel': [[1,1,1,0], [0,1,0,0], [0,1,1,1]],

            'gosper': [
                [0,0,0,0,1,1,0,0,0], [0,0,0,0,1,1,0,0,0],                                                                   // left block
                [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0],                         // zeros
                [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0],                         // zeros
                [0,0,0,0,1,1,1,0,0], [0,0,0,1,0,0,0,1,0], [0,0,1,0,0,0,0,0,1], [0,0,1,0,0,0,0,0,1],                         // left shuttle 1/2
                [0,0,0,0,0,1,0,0,0], [0,0,0,1,0,0,0,1,0], [0,0,0,0,1,1,1,0,0], [0,0,0,0,0,1,0,0,0],                         // left shuttle 2/2
                [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0],                                                                   // zeros
                [0,0,1,1,1,0,0,0,0], [0,0,1,1,1,0,0,0,0], [0,1,0,0,0,1,0,0,0], [0,0,0,0,0,0,0,0,0], [1,1,0,0,0,1,1,0,0],    // right shuttle
                [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0],    // zeros
                [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0],                         // zeros
                [0,0,1,1,0,0,0,0,0], [0,0,1,1,0,0,0,0,0]                                                                    // right block
            ]
        }
        for (var key in this.shapes) {
            this.options.push(key);
        }
        this.ID = this.options[this.option];
    }

    // Checks if cell is in environment
    checkExistance(environment, column, row) {
        if (environment[column][row]) {
            return true;
        } else {
            return false;
        }
    }

    // Change shape
    changeShape(isNext) {

        if (isNext && (this.option < this.options.length - 1)) {
            this.option += 1;
            this.ID = this.options[this.option]
            colorPick += 1
        } else if ((! isNext) && (this.option > 0)) {
            this.option -= 1;
            this.ID = this.options[this.option]
            colorPick -= 1
        }

    }

    // Draw shape
    drawShape(leftColumn, topRow) {

        let chosenShape = this.ID;
        let thisShape = this.shapes[chosenShape];
        console.log(chosenShape)

        for (var offsetColumn = 0; offsetColumn < thisShape.length; offsetColumn++){
            for (var offsetRow = 0; offsetRow < thisShape[0].length; offsetRow++) {

                let thisColumn = leftColumn + offsetColumn;
                let thisRow = topRow + offsetRow;
                let thisCell = grid[thisColumn][thisRow];
                thisCell.setState(thisShape[offsetColumn][offsetRow]);

            }
        }
    }



}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Setup function
function setup() {

    createCanvas(canvasWidth, canvasHeight);
    frameRate(fr);
    newShape = new Shape();

    for (var column = 0; column < columns; column++) {
        
        thisColumn = new Array();
        for (var row = 0; row < rows; row++) {
            let newCell = new Cell(column, row);    // Creating cells on grid
            newCell.setState(Math.floor(Math.random() * 2)); // Comment out to set the initial state to false
            thisColumn[row] = newCell;
        }
        grid[column] = thisColumn;

    }

}





// Draw loop
function draw() {

    background(25);
    stroke(15);
    strokeWeight(.5);
    fill(colorList[colorPick]);

    // Drawing grid
    for (var i = 0; i <= width; i += cellSize) {
        line(i, 0, i, height);
    }
    for (var j = 0; j <= height; j += cellSize) {
        line(0, j, width, j);
    }

    // Iterating over grid for cell evolution
    for (var column = 1; column < columns - 1; column++) {
        for (var row = 1; row < rows - 1; row++) {

            let thisCell = grid[column][row];
            thisCell.updateMemory();

        }
    }

    for (var column = 1; column < columns - 1; column++) {
        for (var row = 1; row < rows - 1; row++) {

            let thisCell = grid[column][row];
            thisCell.drawIfActive();

            if (simIsRunning) {
                thisCell.evolveCell();
            }

        }
    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Click to change state
function mouseReleased() {

    let cursorColumn = Math.floor(mouseX / cellSize);
    let cursorRow = Math.floor(mouseY / cellSize);
    let cursorCell = grid[cursorColumn][cursorRow]

    if (cursorCell.isActivated) {
        cursorCell.setState(false);
    } else {
        cursorCell.setState(true);
    }

    cursorCell.updateMemory();

}




// Resets grid to blank
function doubleClicked() {

    for (var column = 0; column < columns; column++) {
        for (var row = 0; row < rows; row++) {
            let thisCell = grid[column][row];
            thisCell.setState(false);
        }
    }

}




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
        for (var column = 0; column < columns; column++) {
            for (var row = 0; row < rows; row++) {
                let thisCell = grid[column][row];
                thisCell.setState(Math.floor(Math.random() * 2));
            }
        }
    }

    // Click "A" to draw shape
    if (keyCode == 65) {
        let cursorColumn = Math.floor(mouseX / cellSize);
        let cursorRow = Math.floor(mouseY / cellSize);
        newShape.drawShape(cursorColumn, cursorRow);
    }

    // Click ">" and "<" to change shape
    if (keyCode == 190) {
        newShape.changeShape(true)
    } else if (keyCode == 188) {
        newShape.changeShape(false)
    }

}
