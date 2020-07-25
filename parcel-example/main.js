import "regenerator-runtime/runtime";
import * as mobilenet from '@tensorflow-models/mobilenet';
(async function () {
    console.log("here")
    const img = document.getElementById('img');
    // Load the model.
    console.log("here")
    const model = await mobilenet.load();

    // Classify the image.
    const predictions = await model.classify(img);

    console.log('Predictions: ');
    console.log(predictions);
})();