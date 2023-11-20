const express = require("express");
const { runServerCheck } = require("./controllers/api.controllers");
const app = express();

app.get("/api/servercheck", runServerCheck);

module.exports = app;
