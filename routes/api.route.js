const apiRouter = require("express").Router();
const topicsRouter = require("./topics.route.js");

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
