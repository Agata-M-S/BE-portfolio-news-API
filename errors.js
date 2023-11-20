// handles server errors
const serverError = (err, req, res, next) => {
	console.log("server error: ", err);
	if (err.status) {
		res.status(500).send({ msg: "internal server error" });
	}
};

module.exports = { serverError };
