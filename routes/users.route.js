const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users.controller.js");
const { methodNotAllowed } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(methodNotAllowed);

module.exports = usersRouter;
