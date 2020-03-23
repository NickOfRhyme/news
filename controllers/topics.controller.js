const { fetchTopics, insertTopic } = require("../models/topics.model");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.send(topics);
    })
    .catch(err => {
      next(err);
    });
};

const postTopic = (req, res, next) => {
  const { author, slug, description } = req.body;
  insertTopic(author, slug, description)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getTopics, postTopic };
