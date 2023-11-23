const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
	let queryStr = `SELECT * FROM articles WHERE article_id = $1`;

	return db.query(queryStr, [article_id]).then(({ rows }) => {
		if (!rows.length) {
			return Promise.reject({ status: 404, msg: "article does not exist" });
		}
		return rows[0];
	});
};

exports.selectAllArticles = () => {
	const articlesTabColumns =
		"title, articles.author, articles.article_id, topic, articles.created_at, article_img_url, articles.votes ";
	const commentsTabColumns = `COUNT(comments.comment_id) AS comment_count `;

	const groupBy = `GROUP BY articles.article_id `;

	const sortBy = `ORDER BY articles.created_at DESC`;

	let queryStr = `SELECT ${articlesTabColumns}, ${commentsTabColumns} FROM articles LEFT JOIN comments
  ON articles.article_id = comments.article_id 
  ${groupBy} ${sortBy}`;

	return db.query(queryStr).then(({ rows }) => {
		return rows;
	});
};

exports.updateVotesByArticleId = (article, article_id, inc_votes) => {
	if (typeof inc_votes != "number") {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}

	const updatedVotes = (article.votes += inc_votes);
	return db
		.query(
			`UPDATE articles
      SET votes = ${updatedVotes}
      WHERE article_id = ${article_id}
      RETURNING *`
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
