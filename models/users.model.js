const connection = require("../db/connection");

const fetchUserByUsername = username => {
  console.log("in user model");
  return connection
    .select("*")
    .from("users")
    .where({ username: username })
    .then(resultRows => {
      if (resultRows.length === 0)
        return Promise.reject({ message: "Not found", statusCode: 404 });
      return resultRows[0];
    });
};

const lookForUser = username => {
  console.log("in user model, checking for users");
  if (username === undefined) return true;
  return connection
    .select("*")
    .from("users")
    .where({ username: username })
    .then(resultRows => {
      return resultRows.length > 0;
    });
};

module.exports = { fetchUserByUsername, lookForUser };
