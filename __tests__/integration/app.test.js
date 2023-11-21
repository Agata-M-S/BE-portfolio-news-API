const request = require("supertest");
const data = require("../../db/data/test-data/index");
const app = require("../../app");
const seed = require("../../db/seeds/seed");
const db = require("../../db/connection");

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
	test("200: responds with an array of topic objects", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				const { topics } = body;

				expect(topics).toBeInstanceOf(Array);
				expect(topics).toHaveLength(3);
			});
	});
	test("each object should have properties: slug, description", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				const { topics } = body;

				expect(topics).toBeInstanceOf(Array);
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

describe("GET /api/articles/:article_id", () => {
	test("200: responds with a correct article object", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toEqual({
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
});

describe("Error handling", () => {
	test("404: /api/notavalidpath", () => {
		return request(app)
			.get("/api/notavalidpath")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("path does not exist");
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
