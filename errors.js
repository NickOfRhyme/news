exports.handlePSQLErrors = (err, req, res, next) => {
  const PSQLErrors = {
    "22P02": { status: 400, message: "Invalid syntax" },
    23503: { status: 404, message: "Not found" },
    23502: { status: 400, message: "Invalid syntax" },
    42703: { status: 404, message: "Column not found" }
  };
  if (err.code !== undefined) {
    res.status(PSQLErrors[err.code].status).send(PSQLErrors[err.code].message);
  } else {
    next(err);
  }
};
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.statusCode !== undefined)
    res.status(err.statusCode).send(err.message);
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send("Server error");
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send("Method not allowed");
};
