// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);
const normX = x => norm(x, windowWidth);
const normY = x => 1 - norm(x, windowHeight);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);
const denormX = x => denorm(x, windowWidth);
const denormY = x => denorm(1 - x, windowHeight);

const getY = x => A * (x * x) + B * x + C;

function mouseClicked() {
  console.log("Clicked", `${mouseX}, ${mouseY}`);
  let x = normX(mouseX);
  let y = normY(mouseY);
  Xs.push(x);
  Ys.push(y);
  // Everytime we click a mouse we run for this many epochs
  train();
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

function draw_curve() {
  for (let x = 0; x < windowWidth; x += 10) {
    const y = getY(normX(x));
    fill(51);
    ellipse(x, denormY(y), 5);
  }
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
  text(CURRENT_EPOCH, windowWidth - 40, windowHeight - 20);
  noFill();
}

function draw() {
  background(255);
  draw_points();
  draw_loss();
  draw_curve();
  draw_iteration();
}