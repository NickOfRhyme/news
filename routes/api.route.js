const apiRouter = require("express").Router();
const topicsRouter = require("./topics.route.js");
const usersRouter = require("./users.route.js");
const articlesRouter = require("./articles.route.js");
const commentsRouter = require("./comments.route.js");
const endPoints = require("../endpoints.json");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.get("/", (req, res, next) => {
  res.send(endPoints);
});

module.exports = apiRouter;
