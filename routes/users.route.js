const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getUsers,
  postUser,
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
  .post(postUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
