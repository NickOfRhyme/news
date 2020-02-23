const connection = require("../db/connection");

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

module.exports = { fetchTopics, lookForTopic };
