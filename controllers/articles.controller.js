const {
  fetchArticles,
  fetchArticleById,
  updateArticleById
} = require("../models/articles.model.js");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId
} = require("../models/comments.model");

const getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then(article => {
      res.send({ article });
    })
    .catch(err => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then(([article]) => {
      res.send({ article });
    })
    .catch(err => {
      next(err);
    });
};

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return insertCommentByArticleId(article_id, username, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id, req.query)
    .then(comments => {
      res.send({ comments });
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
