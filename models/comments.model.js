const connection = require("../db/connection");
const { lookForArticle } = require("./articles.model");
const { lookForUser } = require("./users.model");

const fetchCommentsByArticleId = (
  article_id,
  { order = "desc", sort_by = "created_at" }
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
    .orderBy(sort_by, order)
    .then(result => {
      // console.log("result: ", result);
      return Promise.all([lookForArticle(article_id), result]);
    })
    .then(([articleOK, result]) => {
      // console.log(articleOK, result);
      if (!articleOK)
        return Promise.reject({ statusCode: 404, message: "Not found" });
      return result;
    });
};

const insertCommentByArticleId = (article_id, username, body) => {
  // console.log("in comments model");
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
  // console.log("in comments model, counting mah comments");
  return connection
    .count("*")
    .from("comments")
    .where({ article_id })
    .first()
    .then(result => result.count);
};

const updateCommentById = (comment_id, inc_votes = 0) => {
  // console.log("in comments model");
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
  // console.log("in comments model");
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
  // console.log("in muh comments model, looking for comments");
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
