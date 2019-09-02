
// 8.26.19
// Sine/Fourier Visualization


// Initialize variables
var octaves = 4;
var margin = 100;
var length = 1300;
var freq = new Array();
var amp = new Array();
var theta = new Array();
let pg;
let i;
let c;
var trails = new Array();
var speedReduce = 3000;
var playback = 60;
let fr = playback;
let controlPos = 1;
var controlRate = 500;
var maxSpeed = 3;
let checkbox;
var speedLookup = [
    0,
    1,
    2,
    3,
    4,
    6,
];
let speed;




// Setup function/normal mode
function setup() {

    createCanvas(windowWidth - margin, windowHeight - margin - 50);
    frameRate(fr);
    setupFree();

    checkbox = createCheckbox('Harmonics');
    checkbox.style('color', 'white');
    checkbox.style('font-family', 'verdana');
    checkbox.position(
        margin + 30,
        ((windowHeight - margin - 50) / 4) + 30 + (60 * octaves)
    );

    checkbox.changed(switchMode);

}




// Free mode
function setupFree() {

    for (var j = 0; j < octaves; j++){

        theta[j] = 0;

        freq[j] = createSlider(0, 200, Math.random() * 200);
        freq[j].position(
            margin + 30, 
            ((windowHeight - margin - 50) / 4) + (60 * j)
        );

        amp[j] = createSlider(2, 100, Math.random() * 98 + 2);
        amp[j].position(
            margin + 30,
            ((windowHeight - margin - 50) / 4) + 30 + (60 * j)
        );

    }
    
}




// Harmonic Mode
function setupHarmonic() {

    for (var j = 0; j < octaves; j++){

        theta[j] = 0;

        freq[j] = createSlider(0, 5, Math.floor(Math.random() * 5));
        freq[j].position(
            margin + 30, 
            ((windowHeight - margin - 50) / 4) + (60 * j)
        );

        amp[j] = createSlider(2, 100, Math.random() * 98 + 2);
        amp[j].position(
            margin + 30,
            ((windowHeight - margin - 50) / 4) + 30 + (60 * j)

        );

    }
    
}




// Draw loop
i = 0;

function draw() {

    var offset = width * 2/3;

    background('black');
    noStroke();
    fill(25);
    rect(offset, 0, width / 3, height);

    fill('white');
    for (var j = 0; j < octaves; j++){

        text(
            'Freq ' + (j+1).toString(),
            margin + 30 + 95,
            freq[j].y - 95
        );

        text(
            'Amp ' + (j+1).toString(),
            margin + 30 + 95,
            freq[j].y - 95 + 30
        );

    }




    // Drawing epicycloid
    let x_cen = width / 3;
    let y_cen = height / 2;
    let x_tan = x_cen + (Math.cos(theta[0]) * amp[0].value());
    let y_tan = y_cen + (Math.sin(theta[0]) * amp[0].value());

    for (var n = 0; n < octaves; n++) {

        stroke(100);
        noFill();
        circle(x_cen, y_cen, amp[n].value() * 2);

        fill('red');
        circle(x_tan, y_tan, 10);

        stroke('sienna');
        line(x_cen, y_cen, x_tan, y_tan);

        if (n + 1 === octaves) {

            var newPoint = [x_tan, y_tan];
            trails[i] = newPoint;

            for (var k = length - 1; k >= 0; k--) {

                if (k < trails.length) {

                    var temp = Math.sqrt(k / length) * 255;
                    c = color(0, 255 - temp, 0);

                    noStroke();
                    fill(c);
                    circle(trails[i-k][0], trails[i-k][1], 2);

                }
            }

            fill('lime');
            circle(x_tan, y_tan, 15);

            stroke('lime');
            noFill();
            circle(x_tan, y_tan, 25);

        }

        if (n + 1 < octaves) {

            x_cen += (Math.cos(theta[n]) * amp[n].value());
            y_cen += (Math.sin(theta[n]) * amp[n].value());
            x_tan += (Math.cos(theta[n+1]) * amp[n+1].value());
            y_tan += (Math.sin(theta[n+1]) * amp[n+1].value());

        }




        // Checking frequency mode
        if (checkbox.checked() === false) {

            theta[n] += (freq[n].value() / speedReduce) * controlPos;

        } else if (checkbox.checked() === true) {

            speed = speedLookup[freq[n].value()] * 30;
            theta[n] += (speed / speedReduce) * controlPos;
        }

    }




    // Drawing fourier sine curve
    noStroke();
    fill('lime');
    circle(offset, trails[i][1], 15);

    for (var k = 0; k < length; k++) {

        if (k < trails.length) {
            
            circle(offset + k/2, trails[i-k][1], 2);

        }

    }

    stroke('rgb(0, 50, 0)');
    line(trails[i][0], trails[i][1], offset, trails[i][1]);




    // End Loop
    i++;

}




// Window resize check
function windowResized() {

    resizeCanvas(windowWidth - margin, windowHeight - margin - 50);

    for (var j = 0; j < octaves; j++) {
        
        freq[j].position(
            margin + 30, 
            ((windowHeight - margin - 50) / 4) + (60 * j)
        );
        amp[j].position(
            margin + 30, 
            ((windowHeight - margin - 50) / 4) + 30 + (60 * j)
        )
    
    }

    i = 0;
    trails = [];
    
}




// Mouse interactions


// Clears canvas
function doubleClicked() {

    i = 0;
    trails = [];
    
}


// Speed control
function mouseWheel(event) {

    controlPos -= event.delta / controlRate;

    if (controlPos < 0) {

        controlPos = 0;

    } else if (controlPos > maxSpeed) {

        controlPos = maxSpeed;

    }

}




// Keyboard interactions
function keyPressed() {


    // Pauses sim
    if (keyCode === SHIFT) {

        if (fr === playback) {

            fr = 0;
            frameRate(fr);
    
        } else {
    
            fr = playback;
            frameRate(fr);
    
        }

    }
    

    // Resests and randomizes sliders
    else if (keyCode === CONTROL) {

        for (var j = 0; j < octaves; j++) {

            freq[j].remove();
            amp[j].remove();

        }

        i = 0;
        trails = [];
        if (checkbox.checked() === true){

            setupHarmonic();
    
        } else {
            
            setupFree();
    
        }

    }

}




// Harmonic/free mode switching
function switchMode() {

    if (this.checked() === true) {

        for (var j = 0; j < octaves; j++) {

            freq[j].remove();
            amp[j].remove();

        }

        i = 0;
        trails = [];
        setupHarmonic();

    }

    if (this.checked() === false) {

        for (var j = 0; j < octaves; j++) {

            freq[j].remove();
            amp[j].remove();

        }

        i = 0;
        trails = [];
        setupFree();
        
    }

}