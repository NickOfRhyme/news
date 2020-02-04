const connection = require("../db/connection");

const fetchTopics = () => {
  console.log("In topics model");
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return { topics };
    });
};

module.exports = { fetchTopics };
