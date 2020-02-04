const apiRouter = require("express").Router();
const topicsRouter = require("./topics.route.js");
const usersRouter = require("./users.route.js");
const articlesRouter = require("./articles.route.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
