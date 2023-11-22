// handles PSQL errors
exports.handlePsqlError = (err, req, res, next) => {
	if (err.code === "22P02") res.status(400).send({ msg: "Bad request" });
	else if (err.code === "23502") res.status(400).send({ msg: "Bad request" });
  else if (err.detail === `Key (author)=(${req.body.username}) is not present in table "users".`) res.status(400).send({ msg: "User doesn't exist" });
	else next(err);
};

exports.handleCustomErorr = (err, req, res, next) => {
	if (err.status) res.status(err.status).send({ msg: err.msg });
	else next(err);
};

// handles server errors
exports.serverError = (err, req, res, next) => {
	console.log("server error: ", err);
	if (err.status) {
		res.status(500).send({ msg: "internal server error" });
	}
};
