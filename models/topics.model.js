const connection = require("../db/connection");

const lookForTopic = topicSlug => {
  // console.log("in topics model, looking for topics");
  if (topicSlug === undefined) return true;
  return connection
    .select("*")
    .from("topics")
    .where({ slug: topicSlug })
    .then(resultRows => {
      // console.log(topicSlug, resultRows.length);
      return resultRows.length > 0;
    });
};

const fetchTopics = () => {
  // console.log("In topics model");
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return { topics };
    });
};

module.exports = { fetchTopics, lookForTopic };
