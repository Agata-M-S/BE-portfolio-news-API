const db = require("../db/connection");


exports.selectCommentsByArticleId = (article_id) => {
	const sortBy = ` ORDER BY created_at DESC`;

	let queryStr = `SELECT * FROM comments WHERE article_id = $1 ${sortBy} `;

	return db.query(queryStr, [article_id]).then(({ rows }) => {
		return rows;
	});
};


exports.updateVotesByArticleId = () =>{
  console.log('in the model');
}