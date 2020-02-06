const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");
const { methodNotAllowed } = require("../errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(methodNotAllowed);

module.exports = topicsRouter;
