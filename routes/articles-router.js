const {
	getArticleById,
	patchVotesByArticleId,
  getAllArticles,
  postArticle,
} = require("../controllers/articles.controllers");
const {
	getCommentsByArticleId,
	postCommentsByArticleId,
} = require("../controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter
.route('/')
.get(getAllArticles)
.post(postArticle)

articlesRouter
	.route("/:article_id")
	.get(getArticleById)
	.patch(patchVotesByArticleId);

articlesRouter
	.route("/:article_id/comments")
	.get(getCommentsByArticleId)
	.post(postCommentsByArticleId);

module.exports = articlesRouter;
