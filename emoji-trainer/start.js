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
        timerId = setInterval(() => {
            // TODO

            console.log(count)
            span.innerText = count;
            count++;
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
        // TODO
    }, 100)
}


async function main() {

    // Setup Models
    console.log("Models Loading...")
    // TODO
    console.log("Models Loaded")


    // Setup WebCam
    let videoElement = document.getElementById("webcam");
    // TODO

    // Setup Run Button
    document
        .getElementById("run-button")
        .addEventListener("click", function () {
            run()
        });
}

main()