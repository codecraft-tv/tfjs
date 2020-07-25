// The equation of a line
const getY = x => A * x + C;

// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);
const normX = x => norm(x, windowWidth);
const normY = x => 1 - norm(x, windowHeight);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);
const denormX = x => denorm(x, windowWidth);
const denormY = x => denorm(1 - x, windowHeight); // 1- so 0 is at the top of the screen and 1 is at the bottom

if (typeof MOUSE_Xs == "undefined") {
    MOUSE_Xs = [];
}

if (typeof MOUSE_Ys == "undefined") {
    MOUSE_Ys = [];
}

if (typeof Xs == "undefined") {
    Xs = [];
}

if (typeof Ys == "undefined") {
    Ys = [];
}

function mouseClicked() {
    console.log("Clicked", `${mouseX}, ${mouseY}`);
    MOUSE_Xs.push(mouseX);
    MOUSE_Ys.push(mouseY);
    let x = normX(mouseX);
    let y = normY(mouseY); // 1- so 0 is at the bottom of the screen and 1 is at the top
    Xs.push(x);
    Ys.push(y);
    // Everytime we click a mouse we run for this many epochs
    train(typeof MAX_EPOCHS == "undefined" ? "" : MAX_EPOCHS);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw_points() {
    noStroke();
    fill(51);
    for (let i = 0; i < Xs.length; i++) {
        let x = denormX(Xs[i]);
        let y = denormY(Ys[i]);
        ellipse(x, y, 10);
    }
    noFill();
}

/**
 * !NOTE! We now have to use denorm functions because the variables A and C are being calculated for normalized points
 */
function draw_line() {
    stroke(51);
    const x1 = denormX(0); // Start on the furthest left
    const y1 = denormY(getY(0)); // Get the y value for this
    const x2 = denormX(1); // End on the furthest right
    const y2 = denormY(getY(1)); // Get the y value for this
    line(x1, y1, x2, y2);
    noStroke();
}

function draw_loss() {
    noStroke();
    fill(0);
    textSize(20);
    textFont("monospace");
    text(LOSS.toFixed(5), 15, windowHeight - 20);
    noFill(); // This resets our fill color
}

function draw_iteration() {
    noStroke();
    fill(0);
    textSize(20);
    textFont("monospace");
    text(typeof CURRENT_EPOCH == "undefined" ? "" : CURRENT_EPOCH, windowWidth - 40, windowHeight - 20);
    noFill();
}

function draw() {
    background(255);
    draw_points();
    draw_loss();
    draw_line();
    draw_iteration();
}