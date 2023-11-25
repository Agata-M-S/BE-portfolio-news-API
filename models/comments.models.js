const db = require("../db/connection");
const { paginate } = require("../utils");

exports.selectCommentsByArticleId = (article_id, page, limit) => {
	const sortBy = ` ORDER BY created_at DESC`;

	let queryStr = `SELECT * FROM comments WHERE article_id = $1 ${sortBy} `;

	return Promise.all([paginate(queryStr, page, limit), article_id])
		.then((resolvedPromises) => {
			const queryStr = resolvedPromises[0];
			const article_id = resolvedPromises[1];

			return db.query(queryStr, [article_id]);
		})
		.then(({ rows }) => {
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

exports.selectCommentById = (comment_id) => {
	return db
		.query(
			`SELECT * FROM comments 
      WHERE comment_id = $1`,
			[comment_id]
		)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: "comment does not exist" });
			}
			return rows[0];
		});
};

exports.removeCommentById = (comment_id) => {
	return db
		.query(
			`DELETE FROM comments
      WHERE comment_id = $1`,
			[comment_id]
		)
		.then(() => {
			console.log("comment was sucessfully removed");
		});
};

exports.updateCommentVotesByCommentId = (
	selectedComment,
	comment_id,
	inc_votes
) => {
	if (typeof inc_votes != "number") {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}
	const updatedVotes = (selectedComment.votes += inc_votes);

	return db
		.query(
			`
  UPDATE comments
  SET votes = ${updatedVotes}
  WHERE comment_id = ${comment_id}
  RETURNING *`
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
