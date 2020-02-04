const {
  fetchArticleById,
  updateArticleById
} = require("../models/articles.model.js");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId
} = require("../models/comments.model");

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
        return Promise.all([article, countComments(article_id)]);
      }
    })
    .then(([result, commentCount]) => {
      result.comment_count = commentCount;
      res.send(result);
    })
    .catch(err => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
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
        res.status(202).send(patchedArticle[0]);
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
  insertCommentByArticleId(article_id, username, body)
    .then(comment => {
      res.status(201).send(comment[0]);
    })
    .catch(err => {
      next(err);
    });
};

const checkUserExists = username => {};

const countComments = article_id => {
  return fetchCommentsByArticleId(article_id).then(resultRows => {
    return resultRows.length;
  });
};

module.exports = { getArticleById, patchArticleById, postCommentByArticleId };
