// UI Config
const PADDING = 10;
const TITLE_TEXT_SIZE = 24;
const DIGIT_UI_SIZE = 400;
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

/**
 * Loads MNIST data and parses into Tensors
 */
async function loadData() {
  PROGRESS_UI.setStatus(`Loading...`);
  DATA = new MnistData();
  await DATA.load();
}

/**
 * Create a Convolutional Neural Network
 */
function createConvModel() {
  // TODO
}

/**
 * Create a Dense Neural Network
 */

function createDenseModel() {
  const model = tf.sequential();
  model.add(tf.layers.flatten({ inputShape: [IMAGE_H, IMAGE_W, 1] }));
  model.add(tf.layers.dense({ units: 42, activation: "relu" }));
  model.add(tf.layers.dense({ units: 10, activation: "softmax" }));
  return model;
}

/**
 * Train the model with the training data
 */
async function trainModel() {
  console.log("Training Model");
  MODEL = createDenseModel();
  MODEL.compile({
    optimizer: "rmsprop",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  const trainData = DATA.getTrainData();

  // This is the total number of batches across all epochs
  let trainBatchCount = 0;
  const totalNumBatches = getNumBatches(trainData.xs);

  console.log("🎉 Training Start");
  await MODEL.fit(trainData.xs, trainData.labels, {
    batchSize: BATCH_SIZE,
    validationSplit: VALIDATION_SPLIT,
    epochs: EPOCHS,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        trainBatchCount++;
        let percentComplete = (
          (trainBatchCount / totalNumBatches) *
          100
        ).toFixed(1);
        PROGRESS_UI.setProgress(percentComplete);
        PROGRESS_UI.setStatus(`ACC ${logs.acc.toFixed(3)}`);
        console.log(`Training... (${percentComplete}% complete)`);
        await tf.nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        valAcc = logs.val_acc;
        console.log(`Accuracy: ${valAcc}`);
        PROGRESS_UI.setStatus(`*ACC ${logs.val_acc.toFixed(3)}`);
        await tf.nextFrame();
      }
    }
  });
  console.log("🍾 Training Complete");

  // Do a final test of the model with the test data, check it against data it's never seen before!

  const testData = DATA.getTestData();
  const testResult = MODEL.evaluate(testData.xs, testData.labels);
  const testAccPercent = testResult[1].dataSync()[0] * 100;
  console.log(`Final test accuracy: ${testAccPercent.toFixed(1)}%`);
}

function inferModel(data) {
  console.log({ data });
  let inputs = tf.tensor4d(data, [1, 28, 28, 1]);
  inputs.print();
  const output = MODEL.predict(inputs);
  const distribution = output.dataSync();
  console.log({ distribution });
  const axis = 1;
  const prediction = Array.from(output.argMax(axis).dataSync())[0];
  console.log({ prediction });
  inputs.dispose();
  output.dispose();
  return { prediction, distribution };
}

async function loadAndTrain() {
  await loadData();
  await trainModel();
}