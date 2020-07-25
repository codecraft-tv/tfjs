// Global Variables
let KNN = null;
let MBNET = null;
let CAMERA = null;

// Config
const TOPK = 10;

function setupButton(id) {
    let timerId = null;
    let btn = document.getElementById(id + "-btn")
    let span = document.getElementById(id + "-text")
    let input = document.getElementById(id + "-input")

    btn.addEventListener("mousedown", () => {
        let text = input.value;
        let count = 0;
        timerId = setInterval(async () => {
            // Start grabbing an image of the video
            const image = await CAMERA.capture();
            // Pump it through mobilenet and get the logits
            const logits = MBNET.infer(image, true);
            console.log(logits.shape);
            // Add this as a bit of data for knn
            KNN.addExample(logits, text);

            console.log(count)
            span.innerText = count;
            count++;

            // Delete memory
            image.dispose();
            if (logits != null) {
                logits.dispose();
            }
        }, 100)
    })
    btn.addEventListener("mouseup", () => {
        // Stop grabbing samples of images
        clearTimeout(timerId);
    });

}

setupButton("sample-1")
setupButton("sample-2")
setupButton("sample-3")

/**
 * Use the trained model to match images to emojis
 */
async function run() {

    let output = document.getElementById("output-result")

    setInterval(async function predict() {
        // Add this as a bit of data for knn
        const numClasses = KNN.getNumClasses();
        if (numClasses > 0) {
            // If classes have been added run predict
            const image = await CAMERA.capture();
            let logits = MBNET.infer(image, "conv_preds");
            const res = await KNN.predictClass(logits, TOPK);
            console.log(res)
            output.innerText = res.label;
            // Delete memory
            image.dispose();
            if (logits != null) {
                logits.dispose();
            }
        }

    }, 100)
}


async function main() {

    // Setup Models
    console.log("Models Loading...")
    KNN = knnClassifier.create();
    MBNET = await mobilenet.load();
    console.log("Models Loaded")

    let videoElement = document.getElementById("webcam");
    CAMERA = await tf.data.webcam(videoElement);

    // Setup Run Button
    document
        .getElementById("run-button")
        .addEventListener("click", function () {
            run()
        });
}

main()