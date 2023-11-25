const {
	selectArticleById,
	selectAllArticles,
	updateVotesByArticleId,
	insertArticle,
} = require("../models/articles.models");
const { checkIfTopicExists } = require("../models/topics.models");
const { paginate } = require("../utils");

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;

	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getAllArticles = (req, res, next) => {
	const { topic, sort_by, order, page, limit } = req.query;

	checkIfTopicExists(topic)
		.then(() => {
			return selectAllArticles(topic, sort_by, order, page, limit);
		})
		.then((articles) => {
      
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.patchVotesByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	return selectArticleById(article_id)
		.then((result) => updateVotesByArticleId(result, article_id, inc_votes))
		.then((updatedArticle) => {
			res.status(200).send({ article: updatedArticle });
		})
		.catch(next);
};

exports.postArticle = (req, res, next) => {
	const insert = req.body;
	insertArticle(insert)
		.then(({ article_id }) => selectArticleById(article_id))
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch(next);
};
