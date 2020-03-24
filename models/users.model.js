const connection = require("../db/connection");

const fetchUsers = () => {
  return connection
    .select("*")
    .from("users")
    .then(users => users);
};

const insertUser = (username, name, avatar_url) => {
  return lookForUser(username).then(userExists => {
    if (userExists)
      return Promise.reject({
        message: "User already registered",
        statusCode: 409
      });
    return connection("users")
      .insert({ username, name, avatar_url })
      .returning("*")
      .then(user => user);
  });
};

const fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(resultRows => {
      if (resultRows.length === 0)
        return Promise.reject({ message: "Not found", statusCode: 404 });
      return resultRows[0];
    });
};

const removeUserByUsername = username => {
  return lookForUser(username).then(userOK => {
    if (!userOK)
      return Promise.reject({ message: "User not found", statusCode: 404 });
    else
      return connection("users")
        .where({ username })
        .del();
  });
};

const lookForUser = username => {
  if (username === undefined) return true;
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(resultRows => {
      return resultRows.length > 0;
    });
};

module.exports = {
  fetchUserByUsername,
  insertUser,
  lookForUser,
  fetchUsers,
  removeUserByUsername
};
