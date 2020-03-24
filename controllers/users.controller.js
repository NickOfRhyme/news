const {
  fetchUserByUsername,
  fetchUsers,
  removeUserByUsername,
  insertUser
} = require("../models/users.model.js");

const getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.send({ users });
    })
    .catch(err => {
      next(err);
    });
};

const postUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  insertUser(username, name, avatar_url)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(err => {
      next(err);
    });
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      res.send({ user });
    })
    .catch(err => {
      next(err);
    });
};

const deleteUserByUsername = (req, res, next) => {
  const { username } = req.params;
  removeUserByUsername(username)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  getUserByUsername,
  getUsers,
  postUser,
  deleteUserByUsername
};
