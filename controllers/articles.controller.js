const {
  fetchArticles,
  fetchArticleById,
  updateArticleById,
  insertArticle,
  removeArticleById
} = require("../models/articles.model.js");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId
} = require("../models/comments.model");

const getArticles = (req, res, next) => {
  const { sort_by, order, author, topic, p, limit } = req.query;

  fetchArticles(sort_by, order, author, topic, p, limit)
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

const deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};

const postArticle = (req, res, next) => {
  const { author, topic, title, body } = req.body;

  return insertArticle(author, topic, title, body)
    .then(([article]) => {
      res.status(201).send({ article });
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
  getCommentsByArticleId,
  postArticle,
  deleteArticleById
};
