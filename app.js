const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route.js");
const { handlePSQLErrors, handleCustomErrors } = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);

module.exports = app;
