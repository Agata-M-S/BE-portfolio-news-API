const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
	const sortBy = ` ORDER BY created_at DESC`;

	let queryStr = `SELECT * FROM comments WHERE article_id = $1 ${sortBy} `;

	return db.query(queryStr, [article_id]).then(({ rows }) => {
		return rows;
	});
};

exports.insertCommentsByArticleId = (article_id, insert) => {
	const { username, body } = insert;

	return db
		.query(
			`INSERT INTO comments (author, body, article_id)
  VALUES ($1, $2, $3)
  RETURNING *`,
			[username, body, article_id]
		)
		.then(({ rows }) => {
			if (!rows[0].body) {
				return Promise.reject({ status: 400, msg: "comment cannot be empty" });
			}
			return rows[0];
		});
};

exports.updateVotesByArticleId = (article, article_id, inc_votes) => {
  
  if (typeof inc_votes != 'number') {
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
