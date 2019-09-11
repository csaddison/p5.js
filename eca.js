//
// 9.4.19
// Conway's Cellular Automaton (ECA)
//

/*
TODO:

*/




// Initialize variables
let columns = 100;
    rows = 60;
let canvasWidth = 1200;
let canvasHeight;

let grid = new Array();
let cellSize = canvasWidth / columns;
let fr = 10;
let simIsRunning = false;

canvasHeight = rows * cellSize;




// Cell class
class Cell {

    constructor(column, row) {
        this.column = column;
        this.row = row;
        this.isActivated = false;
        this.pastState = this.isActivated;
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




// Setup function
function setup() {

    createCanvas(canvasWidth, canvasHeight);
    frameRate(fr);

    for (var column = 0; column < columns; column++) {
        
        thisColumn = new Array();
        for (var row = 0; row < rows; row++) {
            let newCell = new Cell(column, row);    // Creating cells on grid
            newCell.setState(Math.floor(Math.random() * 2))
            thisColumn[row] = newCell;
        }
        grid[column] = thisColumn;

    }

}





// Draw loop
function draw() {

    console.log('==================================================')

    background('white');
    stroke(220);
    strokeWeight(.5);
    fill(0);

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




// Keyboard interaction
function keyPressed() {

    // Pauses sim
    if (keyCode === SHIFT) {
        if (simIsRunning) {
            simIsRunning = false    // Pausing sim
        } else {
            simIsRunning = true     // Unpausing sim
        }
    }

    // Resets grid
    if (keyCode === CONTROL) {
        for (var column = 0; column < columns; column++) {
            for (var row = 0; row < rows; row++) {
                let newCell = grid[column][row];
                newCell.setState(Math.floor(Math.random() * 2))
            }
        }
    }

}