const express = require("express");

const { serverError, handlePsqlError, handleCustomErorr } = require("./errors");

const app = express();
const apiRouter = require('./routes/api-router')
app.use(express.json());
app.use('/api', apiRouter)

app.all("*", (req, res) => {
	res.status(404).send({ msg: "path does not exist" });
});

app.use(handlePsqlError);
app.use(handleCustomErorr);
app.use(serverError);
module.exports = app;
