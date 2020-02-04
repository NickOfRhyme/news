process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  describe("/topics", () => {
    it("GET returns status 200 with a JSON object", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .expect("Content-type", "application/json; charset=utf-8")
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });
    it("object returned by GET has a topic key which contains an array of objects, each of which contains a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          expect(body).to.have.key("topics");
          expect(body.topics).to.be.an("array");
          body.topics.forEach(topic => {
            expect(topic).to.be.an("object");
            expect(topic).to.have.keys("slug", "description");
          });
        });
    });
  });
  describe("/users/:username", () => {
    it("GET returns status 200 with a JSON object", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .expect("Content-type", "application/json; charset=utf-8")
        .then(body => {
          expect(body).to.be.an("object");
        });
    });
    it("object returned by GET has username, avatar_url and name properties", () => {
      return request(app)
        .get("/api/users/lurker")
        .then(({ body }) => {
          expect(body).to.have.keys("username", "avatar_url", "name");
        });
    });
    it("returns 404 and appropriate error message if username does not exits", () => {
      return request(app)
        .get("/api/users/carl_incognito")
        .expect(404)
        .then(({ error }) => {
          expect(error.text).to.equal("Not found");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET returns status 200 with a JSON object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .expect("Content-type", "application/json; charset=utf-8")
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });
    it("object returned by GET has author, title, article_id, body, topic, created_at, votes and comment_count properties", () => {
      return request(app)
        .get("/api/articles/2")
        .then(({ body }) => {
          expect(body).to.have.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET returns 404 and appropriate error message if article_id does not exist", () => {
      return request(app)
        .get("/api/articles/5679")
        .then(({ error }) => {
          expect(error.text).to.equal("Not found");
        });
    });
    it("GET returns status 400 and appropriate error message when article_id is invalid", () => {
      return request(app)
        .get("/api/articles/interestingarticle")
        .expect(400)
        .then(({ error }) => {
          expect(error.text).to.equal("Invalid syntax");
        });
    });
    it("PATCH returns 202 and a JSON object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(202)
        .expect("Content-type", "application/json; charset=utf-8");
    });
    it("PATCH returns object containing correct keys", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .then(({ body }) => {
          expect(body).to.have.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
        });
    });
    it("PATCH successfully increments votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .then(({ body }) => {
          expect(body.votes).to.equal(101);
        });
    });
    it("PATCH successfully decrements votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .then(({ body }) => {
          expect(body.votes).to.equal(99);
        });
    });
    it("PATCH returns 404 when given a non-existent article_id", () => {
      return request(app)
        .patch("/api/articles/10002")
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ error }) => {
          expect(error.text).to.equal("Not found");
        });
    });
    it("PATCH returns 400 when given an invalid article_id", () => {
      return request(app)
        .patch("/api/articles/interesting_article")
        .send({ inc_votes: 2 })
        .expect(400)
        .then(({ error }) => {
          expect(error.text).to.equal("Invalid syntax");
        });
    });
    it("PATCH returns 400 when given an incomplete or malformed request", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ increaseTheVotes: 2 })
        .expect(400)
        .then(({ error }) => {
          expect(error.text).to.equal("Invalid syntax");
        });
    });
    describe.only("/comments", () => {
      it("", () => {});
    });
  });
});
