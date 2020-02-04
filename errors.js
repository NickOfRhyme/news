exports.handlePSQLErrors = (err, req, res, next) => {
  next(err);
};
exports.handleCustomErrors = (err, req, res, next) => {
  res.status(err.statusCode).send(err.message);
};
