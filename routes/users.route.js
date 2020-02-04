const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users.controller.js");

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
