exports.handlePSQLErrors = (err, req, res, next) => {
  const PSQLErrors = { "22P02": { status: 400, message: "Invalid syntax" } };
  if (err.code !== undefined) {
    console.log("PSQL error found:", err.code);
    res.status(PSQLErrors[err.code].status).send(PSQLErrors[err.code].message);
  } else {
    next(err);
  }
};
exports.handleCustomErrors = (err, req, res, next) => {
  console.log("Custom errors");
  res.status(err.statusCode).send(err.message);
};
