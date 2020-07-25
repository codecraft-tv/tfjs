function renderPredictions(predictions) {
    let pre = document.getElementById("predictions");
    let val = "";

    for (prediction of predictions) {
        let perc = (prediction.probability * 100).toFixed(2);
        val += `${pad("     ", perc, true)}% | ${prediction.className}\n`;
        // console.log(val);
    }
    pre.innerHTML = val;
}


function pad(pad, str, padLeft) {
    if (typeof str === 'undefined')
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}