const { runServerCheck } = require("../controllers/api.controllers");
const { getAllArticles } = require("../controllers/articles.controllers");
const {
	getAllEndpoints,
	getTopics,
} = require("../controllers/topics.controllers");
const { getAllUsers } = require("../controllers/users.controllers");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

// apiRouter.get("/articles", getAllArticles);
apiRouter.get("/", getAllEndpoints);
apiRouter.get("/servercheck", runServerCheck);
apiRouter.get("/topics", getTopics);
// apiRouter.get("/users", getAllUsers);

apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
