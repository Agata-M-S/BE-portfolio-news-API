const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
	let queryStr = `SELECT * FROM topics`;

	return db.query(queryStr).then(({ rows }) => {
		return rows;
	});
};

exports.checkIfTopicExists = (topic) => {
	return db.query(`SELECT slug FROM topics`).then(({ rows }) => {
		const listOfTopics = [];
		rows.forEach((topic) => {
			listOfTopics.push(topic.slug);
		});
		if (topic && !listOfTopics.includes(topic)) {
			return Promise.reject({ status: 404, msg: "Not Found" });
		}
	});
};
exports.selectAllEndpoints = () => {
	return fs.readFile(`${__dirname}/../endpoints.json`).then((endpoints) => {
		return JSON.parse(endpoints);
	});
};
