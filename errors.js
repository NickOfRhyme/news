exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err);
  // next(err);
};
exports.handleCustomErrors = (err, req, res, next) => {};
