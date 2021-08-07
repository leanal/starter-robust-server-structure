const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.
const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

const flipsRouter = require("./flips/flips.router");
const countsRouter = require("./counts/counts.router");

app.use(express.json()); // built-in middleware that adds a body property to the request (req.body)

app.get("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    // next(`Count id not found: ${countId}`);
    next({ 
      status: 404, 
      message: `Count id not found: ${countId}` });
  } else {
    res.json({ data: foundCount }); // Return a JSON object, not a number.
  }
});

// app.get("/counts", (req, res) => {
//   res.json({ data: counts });
// });
app.use("/counts", countsRouter); // Note: app.use

/*
app.get("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;
  // const flipId = req.params.flipId;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  if (foundFlip) {
    res.json({ data: foundFlip });
  } else {
    // next(`Flip id not found: ${flipId}`);
    next({ 
      status: 404, 
      message: `Flip id not found: ${flipId}` });
  }
});
*/

// /* Replaced by app.use */
// app.get("/flips", (req, res) => {
//   res.json({ data: flips });
// });
app.use("/flips", flipsRouter); // Note: app.use

/*
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

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

app.post(
  "/flips",
  bodyHasResultProperty, // Add validation middleware function
  (req, res) => {
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
);
*/

// Not found handler
app.use((request, response, next) => {
  // next(`Not found: ${request.originalUrl}`);
  next({ status: 404, message: `Not found: ${request.originalUrl}` });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  // response.send(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
