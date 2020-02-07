const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route.js");
const {
  handlePSQLErrors,
  handleCustomErrors,
  methodNotAllowed,
  handleServerErrors
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);
app.route("/").all(methodNotAllowed);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
