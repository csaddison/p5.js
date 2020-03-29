//
// 11.11.19
// Langton's Ant
//

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Grid class
class Grid {

    constructor(columns, rows, aspectWidth) {
        this.columns = columns;
        this.rows = rows;
        this.aspectWidth = aspectWidth
        this.gridSpacing = aspectWidth / columns;
        this.aspectHeight = this.rows * this.gridSpacing;
        //this.gridSize = this.rows * this.columns;
        this.grid = [];
        this.gridElements = [];
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
                this.gridElements.push(filledGrid);
            }
            this.grid[column] = thisColumn;
        }
    }

    /*
    // Applies a given function to all cells on grid
    applyToGrid_A(func) {
        for (var column = 0; column < this.columns; column++) {
            for (var row = 0; row < this.rows; row++) {
                let gridSpot = this.grid[column][row];
                gridSpot.func();
            }
        }
    }
    applyToGrid_B(func) {
        for (var element of this.gridElements) {
            let gridSpot = this.gridElements[element];
            gridSpot.func();
        }
    }
    */

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Cell class
class Cell {

    constructor(column, row, size) {
        this.column = column;
        this.row = row;
        this.isActivated = false;
        this.position = [column, row];
        this.size = size;
    }

    // Changes cell state
    setState(state) {
        this.isActivated = state;
    }

    // Draws cell if active
    drawIfActive() {
        if (this.isActivated) {
            fill(200)
            rect(this.column * this.size, this.row * this.size, this.size, this.size);
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
    changeState(cell) {
        if (cell.isActivated) {
            cell.setState(false);
            this.turnRight();
        } else {
            cell.setState(true);
            this.turnLeft();
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
                thisCell.setState(false);
            }
        }
    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Initialize variables
let columns = 200;
    rows = 140;
let canvasWidth = 1200;
let fr = 1000;
let simIsRunning = true;


// Setup function
let grid = new Grid(columns, rows, canvasWidth);
let ant = new Ant(Math.floor(columns / 2), Math.floor(rows / 2));
let gridSize = grid.gridSpacing;

function setup() {
    createCanvas(canvasWidth, gridSize * rows);
    frameRate(fr);
    grid.fillGrid(Cell);
}




// Draw loop
function draw() {

    background(25);
    grid.drawGrid(15);

    for (var i=0; i < columns; i++) {
        for (var j=0; j < rows; j++) {
            let thisCell = grid.grid[i][j];
            thisCell.drawIfActive();
        }
    }

    ant.drawAnt(gridSize);

    if (simIsRunning) {

        let antCell = grid.grid[ant.column][ant.row];
        ant.changeState(antCell);
        ant.moveAnt();
        ant.checkBoundaries(grid);
        
    }

}
