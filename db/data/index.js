const ENV = process.env.NODE_ENV || "development";
const {
  topicData,
  articleData,
  userData,
  commentData
} = require(`./${ENV}-data/`);

module.exports = { topicData, articleData, userData, commentData };
