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
  const model = tf.sequential();
  model.add(tf.layers.flatten({
    inputShape: [IMAGE_H, IMAGE_W, 1]
  }));
  model.add(tf.layers.dense({
    units: 42,
    activation: "relu"
  }));
  model.add(tf.layers.dense({
    units: 10,
    activation: "softmax"
  }));
  return model;
}

// Train the model with the training data
async function trainModel() {
  console.log("Training Model");

  MODEL = createDenseModel();

  MODEL.compile({
    optimizer: "rmsprop",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  const trainData = DATA.getTrainData();

  console.log("🎉 Training Start");
  await MODEL.fit(trainData.xs, trainData.labels, {
    batchSize: BATCH_SIZE,
    validationSplit: VALIDATION_SPLIT,
    epochs: EPOCHS
  });
  console.log("🍾 Training Complete");

  // Do a final test of the model with the test data, check it against data it's never seen before!
  const testData = DATA.getTestData();
  const testResult = MODEL.evaluate(testData.xs, testData.labels);
  const testAccPercent = testResult[1].dataSync()[0] * 100;
  console.log(`Final test accuracy: ${testAccPercent.toFixed(1)}%`);
}

function inferModel(data) {
  console.log({
    data
  });

  // Convert our raw inputs into tensors
  let inputs = tf.tensor4d(data, [1, 28, 28, 1]);
  inputs.print();

  // Pump the inputs into our model and have it pump out some outputs
  const output = MODEL.predict(inputs);

  // Let's take a look at exactly what the model is outputting
  const distribution = output.dataSync();
  console.log({
    distribution
  });

  // Get the value with the highest probability
  const prediction = getPrediction(output)
  console.log({
    prediction
  });

  // Don't forget to clean up memory!
  inputs.dispose();
  output.dispose();
  return {
    prediction,
    distribution
  };
}