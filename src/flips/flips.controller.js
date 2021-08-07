const flips = require("../data/flips-data");
const counts = require("../data/counts-data");

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

// New middleware function to validate the request body
function bodyHasResultProperty(req, res, next) {
  const { data: { result } = {} } = req.body;
  if (result) {
    return next(); // Call `next()` without an error message if the result exists
  }
  // next("A 'result' property is required.");
  next({
    status: 400,
    message: "A 'result' property is required.",
  });
}

function resultPropertyIsValid(req, res, next) {
  const { data: { result } = {} } = req.body;
  const validResult = ["heads", "tails", "edge"];
  if (validResult.includes(result)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'result' property must be one of ${validResult}. Received: ${result}`,
  });
}

function flipExists(req, res, next) {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if (foundFlip) {
    res.locals.flip = foundFlip;
    return next();
  }
  next({
    status: 404,
    message: `Flip id not found: ${flipId}`,
  });
}

function create(req, res) {
  // Route handler no longer has validation code.
  const { data: { result } = {} } = req.body;

  // if (result) {
  const newFlip = {
    id: ++lastFlipId, // Increment last ID, then assign as the current ID
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1; // Increment the counts
  // res.json({ data: newFlip });
  res.status(201).json({ data: newFlip });
  // } else {
  //   res.sendStatus(400);
  // }
}

function list(req, res) {
  res.json({ data: flips });
}

function read(req, res) {
//   const { flipId } = req.params; // const flipId = req.params.flipId;
//   const foundFlip = flips.find((flip) => flip.id === Number(flipId));
res.json({ data: res.locals.flip }); // res.json({ data: foundFlip });
}

function update(req, res) {
//   const { flipId } = req.params;
//   const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  const flip = res.locals.flip;
  const originalResult = flip.result; // const originalResult = foundFlip.result;
  const { data: { result } = {} } = req.body;

  if (originalResult !== result) {
    // update the flip
    flip.result = result; //foundFlip.result = result;
    // Adjust the counts
    counts[originalResult] = counts[originalResult] - 1;
    counts[result] = counts[result] + 1;
  }

  res.json({ data: flip }); //res.json({ data: foundFlip });
}

function destroy(req, res) {
  const { flipId } = req.params;
  const index = flips.findIndex((flip) => flip.id === Number(flipId));
  // `splice()` returns an array of the deleted elements, even if it is one element
  const deletedFlips = flips.splice(index, 1);
  deletedFlips.forEach(
    (deletedFlip) =>
      (counts[deletedFlip.result] = counts[deletedFlip.result] - 1)
  );

  res.sendStatus(204);
}

module.exports = {
  create: [bodyHasResultProperty, resultPropertyIsValid, create],
  list,
  read: [flipExists, read],
  update: [flipExists, bodyHasResultProperty, resultPropertyIsValid, update],
  delete: [flipExists, destroy],
};
