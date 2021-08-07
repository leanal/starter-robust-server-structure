const counts = require("../data/counts-data");

function countExists(req, res, next) {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    return next({
      status: 404,
      message: `Count id not found: ${countId}`,
    });
  }
  res.locals.count = foundCount;
  next();
}

function read(req, res, next) {
  res.json({
    data: res.locals.count,
  });
}

function list(req, res) {
  res.json({ data: counts });
}


// app.get("/counts/:countId", (req, res, next) => {
//   const { countId } = req.params;
//   const foundCount = counts[countId];

//   if (foundCount === undefined) {
//     // next(`Count id not found: ${countId}`);
//     next({
//       status: 404,
//       message: `Count id not found: ${countId}`,
//     });
//   } else {
//     res.json({ data: foundCount }); // Return a JSON object, not a number.
//   }
// });

module.exports = {
    list,
    read: [countExists, read],
    countExists,
  };