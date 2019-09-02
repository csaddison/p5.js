// 8.26.19
// Sine/Fourier Visualization


// Initialize variables

var resolution = 3;
let frequency, amplitude, speed; // Positive speed to the right
let dt = 0;

function setup() {
    createCanvas(1280, 720);
    stroke(0, 200, 0);

    freqSlider = createSlider(0, 25, 2);
    freqSlider.position(350, 100);
    ampSlider = createSlider(5, 150, 75);
    ampSlider.position(350, 130);
    speedSlider = createSlider(0, 50, 10);
    speedSlider.position(350, 160);
}


// Draw loop

function draw() {
    var offset = height / 2;

    const frequency = freqSlider.value();
    const amplitude = ampSlider.value();
    const speed = speedSlider.value() / 800;

    background(0);
    noFill();

    beginShape();
    // Setting resolution on curve
    for (var x = 0; x < width + resolution; x += resolution) {
        let rad = (x / width) * 2 *  Math.PI * frequency;
        vertex(x, offset - amplitude * Math.cos(rad - (dt * frequency)));
    }
    endShape();

    dt += speed;
}