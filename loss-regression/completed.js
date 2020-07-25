// Store the loss in this variable and it will be printed on the screen.
let LOSS = 0;

// Every-time you click on the screen the mouse x,y points will be stored in here.
let Xs = [];
let Ys = [];

// The equation of a line
let A = -0.3;
let C = 0.5;

async function train() {
  const actualXs = tf.tensor(Xs);
  const actualYs = tf.tensor(Ys);

  const a = tf.scalar(A);
  const c = tf.scalar(C);

  predictedYs = a.mul(actualXs).add(c);

  let loss = predictedYs
    .sub(actualYs)
    .square()
    .mean();

  LOSS = loss.dataSync()[0];
}