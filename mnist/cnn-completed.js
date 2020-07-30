/*************** GLOBAL VARIABLES  ***********/
var DIGIT_UI = null;
var PREDICTION_UI = null;
var PROGRESS_UI = null;
var MODEL = null;
var DATA = null;

// ML Config
const EPOCHS = 1;
const BATCH_SIZE = 320;
const VALIDATION_SPLIT = 0.15;

/*************** CODE  ***********/

/**
 * Called when the user clicks "Train"
 */
async function loadAndTrain() {
    await loadData();
    await trainModel();
}


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
    // Create a sequential neural network model. tf.sequential provides an API
    // for creating "stacked" models where the output from one layer is used as
    // the input to the next layer.
    const model = tf.sequential();

    // The first layer of the convolutional neural network plays a dual role:
    // it is both the input layer of the neural network and a layer that performs
    // the first convolution operation on the input. It receives the 28x28 pixels
    // black and white images. This input layer uses 16 filters with a kernel size
    // of 5 pixels each. It uses a simple RELU activation function which pretty
    // much just looks like this: __/
    model.add(
        tf.layers.conv2d({
            inputShape: [28, 28, 1],
            kernelSize: 3,
            filters: 16,
            activation: "relu"
        })
    );

    // After the first layer we include a MaxPooling layer. This acts as a sort of
    // downsampling using max values in a region instead of averaging.
    // https://www.quora.com/What-is-max-pooling-in-convolutional-neural-networks
    model.add(tf.layers.maxPooling2d({
        poolSize: 2,
        strides: 2
    }));

    // Our third layer is another convolution, this time with 32 filters.
    model.add(
        tf.layers.conv2d({
            kernelSize: 3,
            filters: 32,
            activation: "relu"
        })
    );

    // Max pooling again.
    model.add(tf.layers.maxPooling2d({
        poolSize: 2,
        strides: 2
    }));

    // Add another conv2d layer.
    model.add(
        tf.layers.conv2d({
            kernelSize: 3,
            filters: 32,
            activation: "relu"
        })
    );

    // Now we flatten the output from the 2D filters into a 1D vector to prepare
    // it for input into our last layer. This is common practice when feeding
    // higher dimensional data to a final classification output layer.
    model.add(tf.layers.flatten({}));

    model.add(tf.layers.dense({
        units: 64,
        activation: "relu"
    }));

    // Our last layer is a dense layer which has 10 output units, one for each
    // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9). Here the classes actually
    // represent numbers, but it's the same idea if you had classes that
    // represented other entities like dogs and cats (two output classes: 0, 1).
    // We use the softmax function as the activation for the output layer as it
    // creates a probability distribution over our 10 classes so their output
    // values sum to 1.
    model.add(tf.layers.dense({
        units: 10,
        activation: "softmax"
    }));

    return model;
}

/**
 * Create a Dense Neural Network
 */
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

/**
 * Called when the user clicks "Check"
 * `data` is the hand drawn digit from the user already represented as an array
 */
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