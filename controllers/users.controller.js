const { fetchUserByUsername } = require("../models/users.model.js");

const getUserByUsername = (req, res, next) => {
  console.log("In user controller");
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getUserByUsername };
