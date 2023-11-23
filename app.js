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
} = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");
const app = express();

patchVotesByArticleId;

app.use(express.json());

app.get("/api/servercheck", runServerCheck);
app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get('/api/users', getAllUsers)


app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.all("*", (req, res) => {
	res.status(404).send({ msg: "path does not exist" });
});

app.use(handlePsqlError);
app.use(handleCustomErorr);
app.use(serverError);
module.exports = app;
