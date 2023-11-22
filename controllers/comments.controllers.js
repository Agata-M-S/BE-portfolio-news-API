const { selectArticleById } = require("../models/articles.models");
const {
	selectCommentsByArticleId,
	insertCommentsByArticleId,
	updateVotesByArticleId,
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

exports.patchVotesByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	return selectArticleById(article_id)
  .then((result) => updateVotesByArticleId(result, article_id, inc_votes))
  .then((updatedArticle)=>{
    res.status(200).send({article: updatedArticle})
  }).catch(next)
  
	;
};
