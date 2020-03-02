const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  postArticle
} = require("../controllers/articles.controller");
const { methodNotAllowed } = require("../errors");

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(methodNotAllowed);

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
