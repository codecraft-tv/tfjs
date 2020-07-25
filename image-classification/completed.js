let model = null;

async function startCamera() {
    // Start the camera
    let videoElement = document.getElementById("video");
    const camera = await tf.data.webcam(videoElement);

    // Take a snapshot every second
    setInterval(async () => {

        // Classify what's in the image using the MobileNet model
        const image = await camera.capture();
        let predictions = await model.classify(image);

        // Render the human readable predictions to the screen
        renderPredictions(predictions);

        // Get the raw inferred model data and print out
        const logits = await model.infer(image);
        logits.print();
        logits.softmax().print();
    }, 1000);
}

async function main() {
    // Initialize MobileNet and wait for is to load all it's required data files over the internet
    model = await mobilenet.load();
    await startCamera();
}
main();