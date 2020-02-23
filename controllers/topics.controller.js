const { fetchTopics } = require("../models/topics.model");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.send(topics);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getTopics };
