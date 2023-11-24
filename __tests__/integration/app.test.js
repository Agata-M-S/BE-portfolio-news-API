const request = require("supertest");
const data = require("../../db/data/test-data/index");
const app = require("../../app");
const seed = require("../../db/seeds/seed");
const db = require("../../db/connection");
require("jest-sorted");

beforeEach(() => {
	return seed(data);
});

afterAll(() => db.end());

describe("GET /api/servercheck", () => {
	test("200: responds with status code 200", () => {
		return request(app)
			.get("/api/servercheck")
			.expect(200)
			.then(({ body }) => {
				expect(body.msg).toBe("All OK!");
			});
	});
});

describe("GET /api/topics", () => {
	test("each object should have properties: slug, description", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				const { topics } = body;

				expect(topics).toHaveLength(3);
				topics.forEach((topic) => {
					expect(topic).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});

describe("GET /api returns an object with a description of all other avaliable endpoints ", () => {
	test("200: responds with a JSON object", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				const { endpoints } = body;
				expect(endpoints).toBeInstanceOf(Object);
				expect(endpoints).not.toBeInstanceOf(Array);
			});
	});

	test("each object has properies: description, queries, exampleResponse", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				const { endpoints } = body;
				for (const [key, value] of Object.entries(endpoints)) {
					expect(value).toMatchObject({
						description: expect.any(String),
						queries: expect.any(Array),
						exampleResponse: expect.anything(),
					});
				}
			});
	});
});

describe("GET /api/articles/:article_id", () => {
	test("200: responds with a correct article object", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: "2020-07-09T20:11:00.000Z",
					votes: 100,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});

	test("an article object should have properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					author: expect.any(String),
					title: expect.any(String),
					article_id: 3,
					body: expect.any(String),
					topic: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					article_img_url: expect.any(String),
				});
			});
	});

	test("GET:400 responds with an appropriate error message when given an invalid id", () => {
		return request(app)
			.get("/api/articles/not-an-id")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
		return request(app)
			.get("/api/articles/999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("article does not exist");
			});
	});
});

describe("GET /api/articles", () => {
	test("200: responds with an array. Each object in the array should have properties: author, title, article_id, topic, created_at, votes, article_im_url, comment_count", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;

				expect(articles).toHaveLength(13);
				articles.forEach((article) => {
					expect(article).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(String),
					});
				});
			});
	});

	test("article objects in the array should be sorted by date in descending order by default", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;

				expect(articles).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
	test("article objects in the array should NOT have a body property", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;

				expect(articles).toHaveLength(13);
				articles.forEach((article) => {
					expect(article).not.toHaveProperty("body");
				});
			});
	});
});

describe("GET /api/articles/:article_id/comments", () => {
	test("200: responds with an array of comments for the given article_id with correct properties", () => {
		return request(app)
			.get("/api/articles/3/comments")
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toHaveLength(2);
				comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						article_id: expect.any(Number),
					});
				});
			});
	});
	test("comment objects in the array should be sorted by date in a descending order", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;

				expect(comments).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
	test("400: responds with appropriate message when passed an invalid article_id", () => {
		return request(app)
			.get("/api/articles/not-a-valid-id/comments")
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("Bad request");
			});
	});
	test("404: responds with an appropriate error message when pass a valid but non-existent article_id ", () => {
		return request(app)
			.get("/api/articles/999/comments")
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe("article does not exist");
			});
	});
	test("200: responds with an empty array if article_id is valid but there are no comments", () => {
		return request(app)
			.get("/api/articles/2/comments")
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toBeInstanceOf(Array);
				expect(comments).toHaveLength(0);
				expect(comments).toEqual([]);
			});
	});
});

describe("POST /api/articles/:article_id/comments", () => {
	test("201: responds with the newly posted comment object ", () => {
		const newComment = {
			username: "butter_bridge",
			body: "this is my comment for the article",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					comment_id: expect.any(Number),
					article_id: 1,
					author: "butter_bridge",
					body: "this is my comment for the article",
					votes: 0,
					created_at: expect.any(String),
				});
			});
	});
	test("posts only username and body property even if passed an object with more properties", () => {
		const newComment = {
			username: "butter_bridge",
			body: "this is my comment for the article",
			age: 21,
			not_valid: "kk",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					comment_id: expect.any(Number),
					article_id: 1,
					author: "butter_bridge",
					body: "this is my comment for the article",
					votes: 0,
					created_at: expect.any(String),
				});
			});
	});
	test("POST:400 responds with an appropriate error message when given an invalid id", () => {
		return request(app)
			.post("/api/articles/not-an-id/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("POST:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
		const newComment = {
			body: "some comment",
			username: "butter_bridge",
		};
		return request(app)
			.post("/api/articles/999/comments")
			.expect(404)
			.send(newComment)
			.then(({ body }) => {
				expect(body.msg).toBe("article does not exist");
			});
	});
	test("POST: 400 responds with an appropriate message if passed an empty comment", () => {
		const newComment = {
			username: "butter_bridge",
			body: "",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("comment cannot be empty");
			});
	});
	test("POST: 400 responds with an appropriate message if passed an incomplete body", () => {
		const newComment = {
			username: "butter_bridge",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("POST: 404 responds with an appropriate message if passed an incorrect username", () => {
		const newComment = {
			username: "aaa",
			body: "my comment",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("User doesn't exist");
			});
	});
});

describe("PATCH /api/articles/:article_id", () => {
	test("PATCH: 200 responds with the newly patched article object increasing the votes when passed a POSITIVE int", () => {
		const patchedComment = {
			inc_votes: 3,
		};

		return request(app)
			.patch("/api/articles/1")
			.send(patchedComment)
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toMatchObject({
					author: expect.any(String),
					title: expect.any(String),
					article_id: 1,
					topic: expect.any(String),
					created_at: expect.any(String),
					body: expect.any(String),
					votes: 103,
					article_img_url: expect.any(String),
				});
			});
	});
	test("PATCH: 200 responds with the newly patched article object increasing the votes when passed a NEGATIVE int", () => {
		const patchedComment = {
			inc_votes: -60,
		};

		return request(app)
			.patch("/api/articles/1")
			.send(patchedComment)
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toMatchObject({
					article_id: 1,
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
					created_at: expect.any(String),
					body: expect.any(String),
					votes: 40,
					article_img_url: expect.any(String),
				});
			});
	});
	test("PATCH: 400 responds with an appropriate error message when given an invalid id", () => {
		return request(app)
			.patch("/api/articles/not-an-id")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("PATCH: 400 responds with an appropriate error message when given an invalid patch object e.i not a number", () => {
		const patchComment = {
			inc_vote: "invalid",
		};

		return request(app)
			.patch("/api/articles/1")
			.send(patchComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("PATCH: 404 sends an appropriate status and error message when given a valid but non-existent id", () => {
		return request(app)
			.patch("/api/articles/999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("article does not exist");
			});
	});
	test("PATCH: 400 responds with an appropriate message if not passed inc_votes property", () => {
		const patchComment = {
			not_a_property: 3,
		};
		return request(app)
			.patch("/api/articles/1")
			.send(patchComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});
describe("DELETE /api/comments/:comment_id", () => {
	test("204: responds with status code 204", () => {
		return request(app).delete("/api/comments/1").expect(204);
	});
	test("DELETE: 404 sends an appropriate status and error message when given a valid but non-existent id", () => {
		return request(app)
			.delete("/api/comments/999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("comment does not exist");
			});
	});
	test("DELETE: 400 responds with an appropriate error message when given an invalid id", () => {
		return request(app)
			.delete("/api/comments/not-a-valid-id")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});

describe("Error handling GET", () => {
	test("400: /api/notavalidpath", () => {
		return request(app)
			.get("/api/notavalidpath")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("path does not exist");
			});
	});
});

describe("GET /api/users", () => {
	test("200: responds with an array of users, each user object in the array should have properties: username, name, avatar_url", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				const { users } = body;

				expect(users).toHaveLength(4);
				users.forEach((article) => {
					expect(article).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					});
				});
			});
	});
});
describe("queries: GET /api/articles?topics=:input", () => {
	test("200: responds with an array of filtered articles specified by the query", () => {
		return request(app)
			.get("/api/articles/?topic=mitch")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;

				expect(articles).toHaveLength(12);
				articles.forEach((article) => {
					expect(article).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: "mitch",
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(String),
					});
				});
			});
	});
	test("filtered article objects in the array should be sorted by date in descending order by default", () => {
		return request(app)
			.get("/api/articles/?topic=mitch")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;

				expect(articles).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
	test("200: responds with an empty array if topic is valid but there are no articles", () => {
		return request(app)
			.get("/api/articles?topic=paper")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toBeInstanceOf(Array);
				expect(articles).toHaveLength(0);
				expect(articles).toEqual([]);
			});
	});
	test("404: responds with an appropriate message if topic doesn't exist", () => {
		return request(app)
			.get("/api/articles/?topic=dogs")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not Found");
			});
	});
});
describe("feature update GET/api/articles/:article_id", () => {
	test("200: responds with an article object that has property comment_count", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toHaveProperty("comment_count");
			});
	});
});
describe("queries GET api/articles?sort_by=:input&order=ASC/DESC", () => {
	test("200: responds with an array of article objects sorted by any valid column in DESCENDING order (by default)", () => {
		return request(app)
			.get("/api/articles?sort_by=topic")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;

				expect(articles).toBeSortedBy("topic", {
					descending: true,
				});
			});
	});
	test("400: responds with an error message when passed invalid sort_by query (column name)", () => {
		return request(app)
			.get("/api/articles?sort_by=cats")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("200: responds with an array of article objects sorted by any valid column in ASCENDING order ", () => {
		return request(app)
			.get("/api/articles?sort_by=votes&order=ASC")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;

				expect(articles).toBeSortedBy("votes", {
					descending: false,
				});
			});
	});
	test("200: responds with an array of article objects sorted by created_at if not passed a sort_by query in ASCENDING order ", () => {
		return request(app)
			.get("/api/articles?order=ASC")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;

				expect(articles).toBeSortedBy("created_at", {
					descending: false,
				});
			});
	});
});
describe("GET /api/users/:username", () => {
	test("200: responds with a correct user object", () => {
		return request(app)
			.get("/api/users/butter_bridge")
			.expect(200)
			.then(({ body }) => {
				expect(body.user).toMatchObject({
					username: "butter_bridge",
					name: expect.any(String),
					avatar_url: expect.any(String),
				});
			});
	});
	test("404: responds with an appropriate message when username not found", () => {
		return request(app)
			.get("/api/users/no_such_user")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Username Not Found");
			});
	});
});
