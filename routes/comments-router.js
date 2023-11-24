const { deleteCommentById, patchCommentVotesByCommentId } = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter
.route("/:comment_id")
.patch(patchCommentVotesByCommentId)
.delete(deleteCommentById)

module.exports = commentsRouter