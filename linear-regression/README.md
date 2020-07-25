1. Demonstrate how it works with the app.

2. Flesh out train() function

Add

```js
const actualXs = tf.tensor(Xs, [Xs.length, 1]);
const actualYs = tf.tensor(Ys, [Ys.length, 1]);
```

Then create `predictedYs`, explain that its the y values on the line

```js
function predict(x) {
  // y = m * x + b
  return a.mul(x).add(c);
}
```

3. Slides for Loss

- Explain how the loss function will work, actualXs, actualYs and predictedYs
- Use Mean squared error to get the loss value.

4. Implement Loss

```js
function loss(predictedYs, actualYs) {
  // Mean Squared Error
  let x = predictedYs
    .sub(actualYs)
    .square()
    .mean();
  return x;
}
```

5. Show the loss value on the bottom right by exporting the LOSS value

```js
function loss(predictedYs, actualYs) {
  // Mean Squared Error
  let x = predictedYs
    .sub(actualYs)
    .square()
    .mean();

  LOSS = x.dataSync()[0];

  return x;
}
```

then add the loss function to the train function

```js
async function train(numIterations = 1) {
  console.log("train() called");

  const actualXs = tf.tensor(Xs, [Xs.length, 1]);
  const actualYs = tf.tensor(Ys, [Ys.length, 1]);
  let predictedYs = predict(actualXs);
  loss(predictedYs, actualYs);
}
```

show how the loss is getting less the closer you are to the line, and worse the further you are from the line.

6. Run a minimise step in the train function

```js
async function train(numIterations = 1) {
  console.log("train() called");

  const actualXs = tf.tensor(Xs, [Xs.length, 1]);
  const actualYs = tf.tensor(Ys, [Ys.length, 1]);

  optimizer.minimize(() => {
    let predictedYs = predict(actualXs);
    return loss(predictedYs, actualYs);
  });

  A = a.dataSync()[0];
  C = c.dataSync()[0];
}
```

We extract A and C so we can see the result on the screen

7. Run the minimise step in a loop

```js
async function train(numIterations = 1) {
  if (Xs.length) {
    for (CURRENT_EPOCH = 0; CURRENT_EPOCH < numIterations; CURRENT_EPOCH++) {
      tf.tidy(() => {
        const actualXs = tf.tensor(Xs, [Xs.length, 1]);
        const actualYs = tf.tensor(Ys, [Ys.length, 1]);

        optimizer.minimize(() => {
          let predictedYs = predict(actualXs);
          return loss(predictedYs, actualYs);
        });

        A = a.dataSync()[0];
        C = c.dataSync()[0];
      });
      await tf.nextFrame();
    }
  }
}
```

- Explain tf.nextFrame
- Explain tf.tidy
- Explain if Xs
