const express = require("express");
const { runServerCheck } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { serverError, customError } = require("./errors");
const app = express();

app.get("/api/servercheck", runServerCheck);
app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
	res.status(404).send({ msg: "path does not exist" });
});

app.use(serverError);
module.exports = app;
