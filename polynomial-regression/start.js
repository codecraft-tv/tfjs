/**
 * The equation for a polynomial (curved line) is this
 *
 * Y = A*X^2 + B*X + C
 *
 * Very similar to the linear regression example previously except now there are 3 variables to optimise, A, B and C instead of just A + C
 *
 *
 * See if you can change this file so it fits a polynomial curve instead.
 */

/** GLOBAL SETTINGS **/
let LOSS = 0;
let CURRENT_EPOCH = 0;
const MAX_EPOCHS = 300;

// This will store mouse x,y points that have been scaled from 0->1
let Xs = [];
let Ys = []

// Coefficients needed to define a curve => Y = A*X^2 + B*X + C
let A = Math.random();
let B = Math.random();
let C = Math.random();

// Create tensor variables to store the weights of A, B and C
const a = tf.variable(tf.scalar(A));
const b = tf.variable(tf.scalar(B));
//TODO: Maybe another TensorFlow variable here?


// Setup the optimizer
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

async function train() {
  for (CURRENT_EPOCH = 0; CURRENT_EPOCH < numIterations; CURRENT_EPOCH++) {
    tf.tidy(() => {
      const actualXs = tf.tensor(Xs, [Xs.length, 1]);
      const actualYs = tf.tensor(Ys, [Ys.length, 1]);

      optimizer.minimize(() => {
        const predictedYs = a.mul(actualXs).add(c); // TODO: Maybe this needs to be turned into the equation of a curve
        let loss = predictedYs
          .sub(actualYs)
          .square()
          .mean();

        LOSS = loss.dataSync()[0];
        return loss;
      });

      A = a.dataSync()[0];
      B = b.dataSync()[0];
      // TODO: Maybe we need to extract the value from another tf.variable here?
    });
    await tf.nextFrame();
  }
}