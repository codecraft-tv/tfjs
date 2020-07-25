// UI Config
var DIGIT_UI = null;
var PREDICTION_UI = null;
var PROGRESS_UI = null;

// ML Config
const EPOCHS = 1;
const BATCH_SIZE = 320;
const VALIDATION_SPLIT = 0.15;
var MODEL = null;
var DATA = null;

/*************** MACHINE LEARNING  ***********/

async function loadAndTrain() {
  await loadData();
  await trainModel();
}

// Loads MNIST data and parses into Tensors
async function loadData() {
  PROGRESS_UI.setStatus(`Loading...`);
  DATA = new MnistData();
  await DATA.load();
}

// Create a Convolutional Neural Network
function createConvModel() {
  // TODO
}

// Create a Dense Neural Network 
function createDenseModel() {
  // TODO
}

// Train the model with the training data
async function trainModel() {
  console.log("Training Model");

  // TODO

  console.log("🎉 Training Start");

  // TODO

  console.log("🍾 Training Complete");

  // Do a final test of the model with the test data, check it against data it's never seen before!

  // TODO

  const testAccPercent = testResult[1].dataSync()[0] * 100;
  console.log(`Final test accuracy: ${testAccPercent.toFixed(1)}%`);
}

function inferModel(data) {
  console.log({
    data
  });

  // TODO
}