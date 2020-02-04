const connection = require("../db/connection");

const fetchArticleById = article_id => {
  console.log("in articles model");
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
    .first()
    .then(result => result);
};

const updateArticleById = (article_id, incrementAmount) => {
  console.log("in articles model");
  return connection("articles")
    .where({ article_id })
    .increment("votes", incrementAmount)
    .returning("*")
    .then(updatedArticle => {
      return updatedArticle;
    });
};

module.exports = { fetchArticleById, updateArticleById };
