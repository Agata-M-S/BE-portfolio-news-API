const express = require("express");
const { runServerCheck } = require("./controllers/api.controllers");
const {
	getTopics,
	getAllEndpoints,
} = require("./controllers/topics.controllers");
const { serverError, handlePsqlError, handleCustomErorr } = require("./errors");
const {
	getArticleById,
	getAllArticles,
	patchVotesByArticleId,
} = require("./controllers/articles.controllers");
const {
	getCommentsByArticleId,
	postCommentsByArticleId,
	deleteCommentById,
} = require("./controllers/comments.controllers");
const app = express();

app.use(express.json());

app.get("/api/servercheck", runServerCheck);
app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", (req, res) => {
	res.status(404).send({ msg: "path does not exist" });
});

app.use(handlePsqlError);
app.use(handleCustomErorr);
app.use(serverError);
module.exports = app;
