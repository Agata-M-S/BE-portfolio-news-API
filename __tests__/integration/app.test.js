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
	describe("Error handling", () => {
		test("400: /api/notavalidpath", () => {
			return request(app)
				.get("/api/notavalidpath")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("path does not exist");
				});
		});
	});
});
