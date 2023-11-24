const { getUserByUsername } = require("../controllers/users.controllers");

const usersRouter = require("express").Router();

usersRouter
.route("/:username")
.get(getUserByUsername);

module.exports = usersRouter;
