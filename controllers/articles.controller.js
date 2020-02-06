const {
  fetchArticles,
  fetchArticleById,
  updateArticleById
} = require("../models/articles.model.js");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  countCommentsByArticleId
} = require("../models/comments.model");

const getArticles = (req, res, next) => {
  console.log("in articles controller");
  fetchArticles(req.query)
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  console.log("in articles controller");

  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then(article => {
      if (article === undefined) {
        return Promise.reject({
          message: "Not found",
          statusCode: 404
        });
      } else {
        return Promise.all([article, countCommentsByArticleId(article_id)]);
      }
    })
    .then(([result, commentCount]) => {
      result.comment_count = commentCount;
      res.send({ article: result });
    })
    .catch(err => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
  console.log("in articles controller");

  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then(patchedArticle => {
      if (patchedArticle.length === 0) {
        return Promise.reject({ message: "Not found", statusCode: 404 });
      } else if (typeof inc_votes !== "number") {
        return Promise.reject({
          message: "Invalid syntax",
          statusCode: 400
        });
      } else {
        res.send({ article: patchedArticle[0] });
      }
    })
    .catch(err => {
      next(err);
    });
};

const postCommentByArticleId = (req, res, next) => {
  console.log("in articles controller");

  const { article_id } = req.params;
  const { username, body } = req.body;

  return insertCommentByArticleId(article_id, username, body)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(err => {
      console.log("caught");
      next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
  console.log("in articles controller");

  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id, req.query)
    .then(comments => {
      res.send({ comments: comments });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  getArticles,
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId
};
