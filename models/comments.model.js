const connection = require("../db/connection");
const { lookForArticle } = require("./articles.model");
const { lookForUser } = require("./users.model");

const fetchCommentsByArticleId = (
  article_id,
  { order = "desc", sort_by = "created_at", p, limit = 10 }
) => {
  const acceptableSorts = [
    "comment_id",
    "created_at",
    "author",
    "title",
    "topic",
    "votes",
    "article_id"
  ];
  if (!acceptableSorts.includes(sort_by)) sort_by = "created_at";
  if (order !== "desc" && order !== "asc") order = "desc";

  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .where({ article_id })
    .from("comments")
    .modify(query => {
      if (p !== undefined) {
        query.offset((p - 1) * limit);
        query.limit(limit);
      }
    })
    .orderBy(sort_by, order)
    .then(result => {
      return Promise.all([lookForArticle(article_id), result]);
    })
    .then(([articleOK, result]) => {
      if (!articleOK)
        return Promise.reject({ statusCode: 404, message: "Not found" });
      return result;
    });
};

const insertCommentByArticleId = (article_id, username, body) => {
  return Promise.all([lookForUser(username)]).then(([userExists]) => {
    if (!userExists)
      return Promise.reject({
        message: "Unauthorised operation",
        statusCode: 401
      });
    return connection("comments")
      .insert({ article_id, body, author: username })
      .returning("*")
      .then(result => result);
  });
};

const countCommentsByArticleId = article_id => {
  return connection
    .count("*")
    .from("comments")
    .where({ article_id })
    .first()
    .then(result => result.count);
};

const updateCommentById = (comment_id, inc_votes = 0) => {
  return lookForComment(comment_id).then(commentOK => {
    if (!commentOK)
      return Promise.reject({ message: "Not found", statusCode: 404 });
    else
      return connection("comments")
        .increment({ votes: inc_votes })
        .where({ comment_id })
        .returning("*")
        .then(result => result);
  });
};

const removeCommentById = comment_id => {
  return lookForComment(comment_id).then(commentOK => {
    if (!commentOK)
      return Promise.reject({ message: "Not found", statusCode: 404 });
    else
      return connection("comments")
        .where({ comment_id })
        .del();
  });
};

const lookForComment = comment_id => {
  return connection("comments")
    .select("*")
    .where({ comment_id })
    .then(resultRows => resultRows.length > 0);
};

module.exports = {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  countCommentsByArticleId,
  updateCommentById,
  removeCommentById
};
