const connection = require("../db/connection");

const fetchCommentsByArticleId = article_id => {
  console.log("in comments model");
  return connection
    .select("*")
    .where({ article_id })
    .from("comments")
    .then(result => result);
};

module.exports = { fetchCommentsByArticleId };
