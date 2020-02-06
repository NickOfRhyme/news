const { fetchTopics } = require("../models/topics.model");

const getTopics = (req, res, next) => {
  // console.log("in topic controller");
  fetchTopics()
    .then(topics => {
      res.send(topics);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getTopics };
