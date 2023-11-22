const { selectArticleById } = require("../models/articles.models");
const {
	selectCommentsByArticleId,
	insertCommentsByArticleId,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;

	selectArticleById(article_id)
		.then(() => {
			selectCommentsByArticleId(article_id).then((comments) => {
				res.status(200).send({ comments });
			});
		})
		.catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const insert = req.body;

	selectArticleById(article_id)
		.then(() => {
			return insertCommentsByArticleId(article_id, insert);
		})
		.then((newComment) => {
			res.status(201).send({ comment: newComment });
		})
		.catch(next);
};
