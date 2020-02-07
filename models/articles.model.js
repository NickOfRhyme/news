const connection = require("../db/connection");
const { lookForTopic } = require("./topics.model");
const { lookForUser } = require("./users.model");

const fetchArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  if (order !== "asc" && order !== "desc") order = "desc";

  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .modify(query => {
      if (author !== undefined) {
        query.where({ "articles.author": author });
      }
      if (topic !== undefined) {
        query.where({ topic });
      }
    })
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .then(result => {
      return Promise.all([lookForTopic(topic), lookForUser(author), result]);
    })
    .then(([topicOK, authorOK, result]) => {
      if (!topicOK || !authorOK)
        return Promise.reject({ statusCode: 400, message: "Column not found" });
      return result;
    });
};

const fetchArticleById = article_id => {
  // console.log("in articles model");
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .first()
    .then(article => {
      if (article === undefined) {
        return Promise.reject({
          message: "Not found",
          statusCode: 404
        });
      } else {
        return article;
      }
    });
};

const updateArticleById = (article_id, inc_votes = 0) => {
  // console.log("in articles model");
  return connection("articles")
    .where({ article_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(updatedArticle => {
      if (updatedArticle.length === 0) {
        return Promise.reject({ message: "Not found", statusCode: 404 });
      } else if (typeof inc_votes !== "number") {
        return Promise.reject({
          message: "Invalid syntax",
          statusCode: 400
        });
      } else {
        return updatedArticle;
      }
    });
};

const lookForArticle = article_id => {
  // console.log("In muh articles model, looking for articles");
  return connection("articles")
    .where({ article_id })
    .then(articles => {
      return articles.length > 0;
    });
};

module.exports = {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  lookForArticle
};
