const connection = require("../db/connection");
const { lookForUser } = require("./users.model");

const lookForTopic = topicSlug => {
  if (topicSlug === undefined) return true;
  return connection
    .select("*")
    .from("topics")
    .where({ slug: topicSlug })
    .then(resultRows => {
      return resultRows.length > 0;
    });
};

const fetchTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return { topics };
    });
};

const insertTopic = (author, slug, description) => {
  return lookForUser(author).then(userExists => {
    if (!userExists)
      return Promise.reject({
        message: "Unauthorised operation",
        statusCode: 401
      });
    return connection("topics")
      .insert({ slug, description })
      .returning("*")
      .then(result => result);
  });
};

module.exports = { fetchTopics, lookForTopic, insertTopic };
