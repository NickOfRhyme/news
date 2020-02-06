const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route.js");
const { handlePSQLErrors, handleCustomErrors } = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);

app.listen(5555, () => {
  // console.log("listening on port 5555...");
});

module.exports = app;
