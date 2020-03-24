const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  deleteArticleById,
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
  .delete(deleteArticleById)
  .all(methodNotAllowed);

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
