// Variables & settings
let LOSS = 0;
let CURRENT_EPOCH = 0;
const MAX_EPOCHS = 300;

// This will store mouse x,y points that have been scaled from 0->1
let Xs = [];
let Ys = [];

// The equation of a line
let A = Math.random();
let C = Math.random();

// Create tensor variables to store the weights of `A` and `C` 
const a = tf.variable(tf.scalar(A));
const c = tf.variable(tf.scalar(C));

// Setup the optimizer
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

async function train() {
  // TODO
}