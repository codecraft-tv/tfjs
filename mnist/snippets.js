// inferModel
function inferModel(data) {
  console.log({
    data
  });
  let inputs = tf.tensor4d(data, [1, 28, 28, 1]);
  inputs.print();
  const output = MODEL.predict(inputs);
  const distribution = output.dataSync();
  console.log({
    distribution
  });
  const axis = 1;
  const prediction = Array.from(output.argMax(axis).dataSync())[0];
  console.log({
    prediction
  });
  inputs.dispose();
  output.dispose();
  return {
    prediction,
    distribution
  };
}

// Callbacks for Model.fit
console.log("🎉 Training Start");
await MODEL.fit(trainData.xs, trainData.labels, {
  batchSize: BATCH_SIZE,
  validationSplit: VALIDATION_SPLIT,
  epochs: EPOCHS,
  callbacks: {
    onBatchEnd: async (batch, logs) => {
      trainBatchCount++;
      let percentComplete = ((trainBatchCount / totalNumBatches) * 100).toFixed(
        1
      );
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

function createDenseModel() {
  const model = tf.sequential();
  model.add(
    tf.layers.flatten({
      inputShape: [IMAGE_H, IMAGE_W, 1]
    })
  );
  model.add(
    tf.layers.dense({
      units: 42,
      activation: "relu"
    })
  );
  model.add(
    tf.layers.dense({
      units: 10,
      activation: "softmax"
    })
  );
  return model;
}

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
