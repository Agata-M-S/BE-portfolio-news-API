const db = require("../db/connection");
const { paginate } = require("../utils");

exports.selectArticleById = (article_id) => {
	const articlesTabColumns =
		"title, articles.author, articles.body, articles.article_id, topic, articles.created_at, article_img_url, articles.votes ";

	let queryStr = `SELECT ${articlesTabColumns}, COUNT(comment_id) AS comment_count 
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id 
  WHERE articles.article_id = $1 GROUP BY articles.article_id`;

	return db.query(queryStr, [article_id]).then(({ rows }) => {
		if (!rows.length) {
			return Promise.reject({ status: 404, msg: "article does not exist" });
		}
		return rows[0];
	});
};

exports.selectAllArticles = (topic, sort_by, order, page, limit) => {
	const validSortBy = [
		"title",
		"author",
		"article_id",
		"topic",
		"created_at",
		"votes",
		"comment_count",
	];

	// protects against SQL injection
	if (sort_by && !validSortBy.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}

	const articlesTabColumns =
		"title, articles.author, articles.article_id, topic, articles.created_at, article_img_url, articles.votes ";
	const commentsTabColumns = `COUNT(comments.comment_id) AS comment_count `;

	const groupBy = `GROUP BY articles.article_id `;

	let orderBy = "DESC ";
	let sortBy = `ORDER BY articles.created_at `;
	let queryStr = `SELECT ${articlesTabColumns}, ${commentsTabColumns} FROM articles LEFT JOIN comments
  ON articles.article_id = comments.article_id `;

	let queryValues = [];

	if (topic) {
		queryValues.push(topic);
		queryStr += "WHERE topic = $1";
	}

	if (sort_by) {
		sortBy = `ORDER BY ${sort_by} `;
	}

	if (order) {
		orderBy = order;
	}

	queryStr += groupBy + sortBy + orderBy;
	let articleCount;
	if (topic) {
		articleCount = db.query(
			`SELECT CAST(COUNT(article_id) AS INT ) AS total_count FROM articles WHERE topic = $1`,
			[topic]
		);
	} else {
		articleCount = db.query(
			`SELECT CAST(COUNT(article_id) AS INT ) AS total_count FROM articles`
		);
	}
  queryStr = paginate(queryStr,page, limit)
  const articles = db.query(queryStr, queryValues)

  return Promise.all([articles, articleCount]).then((promises)=>{
    return [promises[0].rows, promises[1].rows[0].total_count]
  })
	// return Promise.all([paginate(queryStr, page, limit), queryValues, articleCount])
	// 	.then((resolvedPromise) => {
	// 		return db.query(resolvedPromise[0], resolvedPromise[1], resolvedPromise[2]);
	// 	})
	// 	.then(({ rows }) => {
  //     console.log(rows);
	// 		return rows;
	// 	});
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

exports.insertArticle = (insert) => {
	const { author, body, title, topic, article_img_url } = insert;
	const insertsArray = [author, body, title, topic, article_img_url];
	let queryStr = `INSERT INTO articles `;

	if (!body) {
		return Promise.reject({ status: 400, msg: "Article cannot be empty" });
	}
	if (!author) {
		return Promise.reject({ status: 400, msg: "Author cannot be empty" });
	}

	if (!article_img_url) {
		insertsArray.pop();
		queryStr += `(author, body, title, topic)
      VALUES ($1, $2, $3, $4)  
      RETURNING article_id`;
	} else {
		queryStr += `(author, body, title, topic, article_img_url)
      VALUES ($1, $2, $3, $4, $5)  
      RETURNING article_id`;
	}

	return db.query(queryStr, insertsArray).then(({ rows }) => {
		return rows[0];
	});
};
