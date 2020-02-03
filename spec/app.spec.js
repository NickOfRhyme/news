const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  // beforeEach(() => {
  //   connection.seed.run();
  // });
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
});
