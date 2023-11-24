const { getUserByUsername, getAllUsers } = require("../controllers/users.controllers");

const usersRouter = require("express").Router();

usersRouter
.get("/", getAllUsers);

usersRouter
.route("/:username")
.get(getUserByUsername);

module.exports = usersRouter;
