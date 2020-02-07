const apiRouter = require("express").Router();
const topicsRouter = require("./topics.route.js");
const usersRouter = require("./users.route.js");
const articlesRouter = require("./articles.route.js");
const commentsRouter = require("./comments.route.js");
const endPoints = require("../endpoints.json");
const { methodNotAllowed } = require("../errors");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter
  .route("/")
  .get((req, res, next) => {
    res.send(endPoints);
  })
  .all(methodNotAllowed);

module.exports = apiRouter;
