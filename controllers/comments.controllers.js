const { selectArticleById } = require("../models/articles.models");
const {
	selectCommentsByArticleId,
	insertCommentsByArticleId,
	removeCommentById,
	selectCommentById,
	updateCommentVotesByCommentId,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const { page, limit } = req.query;
	selectArticleById(article_id)
		.then(() => {
			return selectCommentsByArticleId(article_id, page, limit);
		})
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const insert = req.body;
	Promise.all([
		selectArticleById(article_id),
		insertCommentsByArticleId(article_id, insert),
	])
		.then((returnPromiseArray) => {
			const newComment = returnPromiseArray[1];
			res.status(201).send({ comment: newComment });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;

	selectCommentById(comment_id)
		.then(() => {
			removeCommentById(comment_id);
		})
		.then(() => {
			res.status(204).send({ msg: "successfully removed" });
		})
		.catch(next);
};

exports.patchCommentVotesByCommentId = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	return selectCommentById(comment_id)
		.then((selectedComment) =>
			updateCommentVotesByCommentId(selectedComment, comment_id, inc_votes)
		)
		.then((updatedComment) => {
			res.status(200).send({ comment: updatedComment });
		})
		.catch(next);
};
