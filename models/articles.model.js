const connection = require("../db/connection");
const { lookForTopic } = require("./topics.model");
const { lookForUser } = require("./users.model");

const fetchArticles = (sort_by, order, author, topic, page, limit = 10) => {
  const acceptableSorts = [
    "created_at",
    "author",
    "title",
    "topic",
    "votes",
    "article_id",
    "comment_count"
  ];
  if (order !== "asc" && order !== "desc") order = "desc";
  if (!acceptableSorts.includes(sort_by)) sort_by = "created_at";

  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes",
      "articles.body AS preview"
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
      if (page !== undefined) {
        query.offset((page - 1) * limit);
        query.limit(limit);
      }
    })
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .then(result => {
      return Promise.all([
        lookForTopic(topic),
        lookForUser(author),
        countArticles(author, topic),
        result
      ]);
    })
    .then(([topicOK, authorOK, articleCount, result]) => {
      if (!topicOK || !authorOK)
        return Promise.reject({ statusCode: 400, message: "Column not found" });
      return result.map(article => {
        article.preview = article.preview.slice(0, 30) + "...";
        article.total_count = articleCount;
        return article;
      });
    });
};

const fetchArticleById = article_id => {
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

const removeArticleById = article_id => {
  return lookForArticle(article_id).then(articleOK => {
    if (!articleOK)
      return Promise.reject({ message: "Not found", statusCode: 404 });
    else
      return connection("articles")
        .where({ article_id })
        .del();
  });
};

const insertArticle = (author, topic, title, body) => {
  return Promise.all([lookForUser(author), lookForTopic(topic)]).then(
    ([userExists, topicExists]) => {
      if (!userExists || !topicExists)
        return Promise.reject({
          message: "Unauthorised operation",
          statusCode: 401
        });
      return connection("articles")
        .insert({ author, topic, title, body })
        .returning("*")
        .then(result => result);
    }
  );
};

const lookForArticle = article_id => {
  return connection("articles")
    .where({ article_id })
    .then(articles => {
      return articles.length > 0;
    });
};

const countArticles = (author, topic) => {
  return connection("articles")
    .modify(query => {
      if (author !== undefined) {
        query.where({ author });
      }
      if (topic !== undefined) {
        query.where({ topic });
      }
    })
    .count("*")
    .then(result => {
      return result[0].count;
    });
};

module.exports = {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  lookForArticle,
  insertArticle,
  removeArticleById
};
