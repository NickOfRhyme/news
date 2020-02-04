const connection = require("../db/connection");

const fetchCommentsByArticleId = article_id => {
  console.log("in comments model");
  return connection
    .select("*")
    .where({ article_id })
    .from("comments")
    .then(result => result);
};

const insertCommentByArticleId = (article_id, username, body) => {
  console.log("in comments model");
  return connection("comments")
    .insert({ article_id, body, author: username })
    .returning("*")
    .then(result => result);
};

module.exports = { fetchCommentsByArticleId, insertCommentByArticleId };
