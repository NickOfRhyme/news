const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId
} = require("../controllers/articles.controller");

articlesRouter.route("/:article_id/comments").post(postCommentByArticleId);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = articlesRouter;
