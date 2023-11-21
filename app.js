const express = require("express");
const { runServerCheck } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { serverError, handlePsqlError, handleCustomErorr } = require("./errors");
const { getArticleById } = require("./controllers/articles.controllers");
const app = express();

app.get("/api/servercheck", runServerCheck);
app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.all("*", (req, res) => {
	res.status(404).send({ msg: "path does not exist" });
});

app.use(handlePsqlError);
app.use(handleCustomErorr)
app.use(serverError);
module.exports = app;
