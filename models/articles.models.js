const db = require("../db/connection");

exports.selectArticle = (article_id) => {
	let queryStr = `SELECT * FROM articles `;
	let queryValues = [];

	if (article_id) {
		queryValues.push(article_id);
		queryStr += "WHERE article_id = $1";
	}

	return db.query(queryStr, queryValues).then(({ rows }) => {
		if (!rows.length) {
			return Promise.reject({ status: 404, msg: "article does not exist" });
		}

		return rows[0];
	});
};
