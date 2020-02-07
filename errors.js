exports.methodNotAllowed = (err, req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const PSQLErrors = {
    "22P02": { status: 400, message: "Invalid syntax" },
    23503: { status: 404, message: "Not found" },
    23502: { status: 400, message: "Invalid syntax" },
    42703: { status: 404, message: "Column not found" }
  };
  if (err.code !== undefined) {
    // console.log("PSQL error found:", err.code);
    res.status(PSQLErrors[err.code].status).send(PSQLErrors[err.code].message);
  } else {
    next(err);
  }
};
exports.handleCustomErrors = (err, req, res, next) => {
  // console.log("Custom error: ", err);
  res.status(err.statusCode).send(err.message);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send("Server error");
};
