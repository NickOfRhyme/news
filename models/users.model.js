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

module.exports = { fetchUserByUsername };
