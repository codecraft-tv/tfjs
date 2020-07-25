/**
 * Let's cover the basics of tensors and the maths you can do on them
 */

// CREATING & PRINTING  ---------------------------------------------------------

var a = tf.tensor([1, 2, 3]);
console.log(a.rank);
console.log(a.shape);
a.print();

// Can use type to make it clearer
var a = tf.tensor1d([1, 2, 3]);
console.log(a.rank);
console.log(a.shape);
a.print();

// You can grab the data inside the Tensor by using the `dataSync` function.
var data = a.dataSync();
console.log(data);


// Also using types catches errors
// var a = tf.tensor1d([[1, 2, 3]]);
// console.log(a.rank);
// console.log(a.shape);
// a.print();

// Errors out - shape is wrong
var a = tf.tensor([
  [1, 2],
  [3]
]);
console.log(a.rank);
console.log(a.shape);
a.print();

// Add a value to make it work
var a = tf.tensor([
  [1, 2],
  [3, 4]
]);
console.log(a.rank);
console.log(a.shape);
a.print();

// Or you can provide a flat array and define a shape
var a = tf.tensor([1, 2, 3, 4], [2, 2]);
console.log(a.rank);
console.log(a.shape);
a.print();

// BASIC OPERATIONS ---------------------------------------------------------

// You can transpose a matrix
var a = tf.tensor([3, 8, 4, 6], [2, 2]);
var b = a.transpose();
b.print();
console.log(b.rank);
console.log(b.shape);

// Addition
var a = tf.tensor([3, 8, 4, 6], [2, 2]);
var b = tf.tensor([
  [4, 0],
  [1, -9]
]);

a.add(b).print();

// Broadcasting
var c = tf.tensor(4);
a.add(c).print();

var c = tf.tensor([
  [4]
]);
a.add(c).print();

// Subtraction
a.sub(b).print();

// Division
var a = tf.tensor([
  [2, 2],
  [2, 2]
]);
var b = tf.tensor([
  [1, 2],
  [3, 4]
]);
a.div(b).print();

// QUIZ - Take 2 from every value in the 3d array you created before

var a = tf.tensor3d([4, 5, 6], [3, 1, 1]);

{
  var a = tf.tensor3d([4, 5, 6], [3, 1, 1]);
  var b = tf.tensor3d([2, 2, 2], [3, 1, 1]);
  a.sub(b).print();
}

{
  var a = tf.tensor3d([4, 5, 6], [3, 1, 1]);
  a.sub(tf.tensor(2)).print();
}

{
  var a = tf.tensor3d([4, 5, 6], [3, 1, 1]);
  a.sub(2).print();
}

// MULTIPLICATION OPERATIONS ---------------------------------------------------------

var a = tf.tensor([3, 8, 4, 6], [2, 2]);
var b = tf.tensor([
  [4, 0],
  [1, -9]
]);

// Multiply by a Constant
b.mul(2).print();

// Multiply by another matrix (element wise multiplication), shape has to be the same
var a = tf.tensor([
  [1, 2],
  [3, 4]
]);
var b = tf.tensor([
  [2, 3],
  [4, 5]
]);
a.mul(b).print();

// MEAN SQUARED ERROR  ---------------------------------------------------------

// How close are these two tensors from each other?
var a = tf.tensor1d([5, 10, 3, 12]);
var b = tf.tensor1d([3, 3, 2, 11]);

// One solution is to take one away from the other and then get the average like so:
a.sub(b)
  .mean()
  .print();

// But order shouldn't matter, a - b or b - a they are still just as different, but it does!
b.sub(a)
  .mean()
  .print();

// The problem is that mean only really works in this case if all the distances are positive, if some are negative then they cancel each other out which we don't want.
a.sub(b).print();
b.sub(a).print();

// One common solution is to use mean squared error
a.sub(b)
  .square()
  .mean()
  .print();
b.sub(a)
  .square()
  .mean()
  .print();