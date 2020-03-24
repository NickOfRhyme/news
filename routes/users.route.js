const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getUsers,
  deleteUserByUsername
} = require("../controllers/users.controller.js");
const { methodNotAllowed } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .delete(deleteUserByUsername)
  .all(methodNotAllowed);

usersRouter
  .route("/")
  .get(getUsers)
  .all(methodNotAllowed);

module.exports = usersRouter;
