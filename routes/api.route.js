const apiRouter = require("express").Router();
const topicsRouter = require("./topics.route.js");
const usersRouter = require("./users.route.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
