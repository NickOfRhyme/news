const ENV = process.env.NODE_ENV || "development";
const test = require("./test-data");
const development = require("./development-data");
// const {
//   topicData,
//   articleData,
//   userData,
//   commentData
// } = require(`./${ENV}-data/index`);

const data = { test, development, production: development };

module.exports = data[ENV];

// module.exports = { topicData, articleData, userData, commentData };
