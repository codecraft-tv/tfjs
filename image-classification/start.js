let model = null;

async function startCamera() {
    // Start the camera
    // TODO

    // Take a snapshot every second
    setInterval(async () => {

        // Classify what's in the image using the MobileNet model
        // TODO

        // Render the human readable predictions to the screen
        // TODO

        // Get the raw inferred model data and print out
        // TODO
    }, 1000);
}

async function main() {
    // Initialize MobileNet and wait for is to load all it's required data files over the internet
    // TODO
    await startCamera();
}
main();