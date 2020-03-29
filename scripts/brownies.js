//
// 1/9/2020
// Brownie thing for Katie

let img;
function preload() {
  img = loadImage('images/brownie.png');
}

let numBrown = 1;
let brownies = [];
function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20)
    img.resize(100, 100)

    for (var i=0; i < numBrown; i++) {
        brownies.push([
            Math.random() * width,
            Math.random() * height,
            Math.random() * 3 * ((-1) ** (Math.floor(Math.random() * 3))) ,
            Math.random() * 3 * ((-1) ** (Math.floor(Math.random() * 3)))
        ])
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {

    let burgandy = color('#4d0013')
    background(burgandy)

    for (brownie of brownies) {
        image(img, brownie[0], brownie[1]);
        brownie[0] += brownie[2];
        brownie[1] += brownie[3];
        if (brownie[0] >= width - 100 || brownie[0] < 0) {
            brownie[2] *= -1
        } else if (brownie[1] >= height - 100 || brownie[1] < 0) {
            brownie[3] *= -1
        }
    }

}