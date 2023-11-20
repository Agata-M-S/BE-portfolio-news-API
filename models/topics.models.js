const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
	let queryStr = `SELECT * FROM topics`;

	return db.query(queryStr).then(({ rows }) => {
		return rows;
	});
};

exports.selectAllEndpoints = () => {
	return fs
		.readFile(`${__dirname}/../endpoints.json`)
		.then((endpoints) => {
			return JSON.parse(endpoints);
		})
};
