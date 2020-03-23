const topicsRouter = require("express").Router();
const { getTopics, postTopic } = require("../controllers/topics.controller");
const { methodNotAllowed } = require("../errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
