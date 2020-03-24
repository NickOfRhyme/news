process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
chai.use(require("sams-chai-sorted"));
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

after(() => {
  console.log("destroying connection");
  connection.destroy(() => {
    console.log("connection destroyed");
  });
});

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("/topics", () => {
    describe("GET", () => {
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
    describe("POST", () => {
      it("POSTING a new topic returns status 201 and a topic object containing the slug and description", () => {
        return request(app)
          .post("/api/topics")
          .send({
            author: "rogersop",
            slug: "defenestration",
            description: "articles about chucking stuff out of windows"
          })
          .then(({ body }) => {
            expect(body).to.be.an("object");
            expect(body.topic).to.have.keys("slug", "description");
          });
      });
    });
  });
  describe.only("/users", () => {
    describe("GET", () => {
      it("GET returns an array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.be.an("array");
            body.users.forEach(user => {
              expect(user).to.be.an("object");
              expect(user).to.have.keys("username", "avatar_url", "name");
            });
          });
      });
    });
    describe("/:username", () => {
      describe("GET", () => {
        it("GET returns status 200 with a JSON object", () => {
          return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .expect("Content-type", "application/json; charset=utf-8")
            .then(body => {
              expect(body).to.be.an("object");
            });
        });
        it("object returned by GET has 'user' property, which contains an object with username, avatar_url and name properties", () => {
          return request(app)
            .get("/api/users/lurker")
            .then(({ body }) => {
              expect(body.user).to.have.keys("username", "avatar_url", "name");
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
      describe("DELETE", () => {
        it("DELETE removes the given user and returns an empty body", () => {
          return request(app)
            .delete("/api/users/lurker")
            .expect(204)
            .then(({ body }) => {
              expect(body).to.deep.equal({});
            });
        });
        it("attempts to DELETE a non-existant user return 404", () => {
          return request(app)
            .delete("/api/users/mrmanager")
            .expect(404)
            .then(error => {
              expect(error.text).to.equal("User not found");
            });
        });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("GET returns object containing array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .expect("Content-type", "application/json; charset=utf-8")
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
          });
      });
      it("article objects within array contain correct properties", () => {
        return request(app)
          .get("/api/articles")
          .then(({ body }) => {
            body.articles.forEach(article => {
              expect(article).to.have.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "total_count",
                "created_at",
                "votes",
                "comment_count",
                "preview"
              );
            });
          });
      });
      it("when pagination is specified, array contains 10 articles", () => {
        return request(app)
          .get("/api/articles?p=1")
          .then(({ body }) => {
            expect(body.articles).to.be.length(10);
          });
      });
      it("when pagination is specified an a limit of 6 is set, array contains 6 articles", () => {
        return request(app)
          .get("/api/articles?p=1&limit=6")
          .then(({ body }) => {
            expect(body.articles).to.be.length(6);
          });
      });
      it("article objects within array are by default sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("created_at");
          });
      });
      it("article objects within array can be sorted by other columns", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("topic");
          });
      });
      it("attempts to sort by a non-existent column result in a reversion to default sorting", () => {
        return request(app)
          .get("/api/articles?sort_by=delightfulness")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("created_at");
          });
      });
      it("article objects within array can be sorted in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy("author");
          });
      });
      it("attempts to sort by something other than 'desc' or 'asc' result in a reversion to descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=importance")
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("title");
          });
      });
      it("articles can be filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .then(({ body }) => {
            body.articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
          });
      });
      it("topics which exist but contain no articles result in an empty array", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .then(({ body }) => {
            expect(body.articles).to.deep.equal([]);
          });
      });
      it("attempts to filter by non-existent topic result in 400", () => {
        return request(app)
          .get("/api/articles?topic=golf")
          .expect(400)
          .then(({ error }) => {
            expect(error.text).to.equal("Column not found");
          });
      });
      it("articles can be filtered by author", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .then(({ body }) => {
            body.articles.forEach(article => {
              expect(article.author).to.equal("icellusedkars");
            });
          });
      });
      it("attempts to filter by authors who exist but contain no articles result in an empty array", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .then(({ body }) => {
            expect(body.articles).to.deep.equal([]);
          });
      });
      it("attempts to filter by non-existent author result in 400", () => {
        return request(app)
          .get("/api/articles?author=karlheinzvonklausewitz")
          .expect(400)
          .then(({ error }) => {
            expect(error.text).to.equal("Column not found");
          });
      });
    });
    describe("POST", () => {
      it("POST returns an object with correct keys and content", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "rogersop",
            topic: "cats",
            title: "What a movie",
            body: "I feel bad for Tom Hooper"
          })
          .then(({ body }) => {
            expect(body.article).to.have.keys(
              "article_id",
              "title",
              "topic",
              "body",
              "author",
              "votes",
              "created_at"
            );
            expect(body.article.body).to.equal("I feel bad for Tom Hooper");
          });
      });
    });
  });
  describe("/articles/:article_id", () => {
    describe("GET", () => {
      it("GET returns status 200 with a JSON object", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .expect("Content-type", "application/json; charset=utf-8")
          .then(({ body }) => {
            expect(body).to.be.an("object");
          });
      });
      it("object returned by GET has and 'article' property, containing an object with author, title, article_id, body, topic, created_at, votes and comment_count properties", () => {
        return request(app)
          .get("/api/articles/2")
          .then(({ body }) => {
            expect(body.article).to.have.keys(
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
    });
    describe("PATCH", () => {
      it("PATCH returns 200 and a JSON object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .expect("Content-type", "application/json; charset=utf-8");
      });
      it("PATCH returns object containing correct keys", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .then(({ body }) => {
            expect(body.article).to.have.keys(
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
            expect(body.article.votes).to.equal(101);
          });
      });
      it("PATCH successfully decrements votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1 })
          .then(({ body }) => {
            expect(body.article.votes).to.equal(99);
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
      it("PATCH returns 200 when given an incomplete or malformed request, and does not increment votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ increaseTheVotes: 2 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(100);
          });
      });
    });
    describe("/comments", () => {
      describe("GET", () => {
        it("GET returns an object containing an array", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .expect("Content-type", "application/json; charset=utf-8")
            .then(({ body }) => {
              expect(body.comments).to.be.an("array");
            });
        });
        it("comments array contains comment objects, each with the correct properties", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .then(({ body }) => {
              body.comments.forEach(comment => {
                expect(comment).to.be.an("object");
                expect(comment).to.have.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
              });
            });
        });
        it("When requesting comments from a non-existent article, gives a 404 status", () => {
          return request(app)
            .get("/api/articles/1000/comments")
            .expect(404)
            .then(({ error }) => {
              expect(error.text).to.equal("Not found");
            });
        });
        it("When requesting comments from an existing article that has not been commented on, returns an empty array", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.deep.equal([]);
            });
        });
        it("comments array is by default sorted by 'created_at' in descending order", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
            });
        });
        it("when pagination is specified and a limit of 3 is set, returns an array of 3 comments", () => {
          return request(app)
            .get("/api/articles/1/comments?p=1&limit=3")
            .then(({ body }) => {
              expect(body.comments).to.be.length(3);
            });
        });
        it("array within GET can be sorted by comment_id", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id")
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("comment_id");
            });
        });
        it("array within GET can be sorted by votes in ascending order", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=asc")
            .then(({ body }) => {
              expect(body.comments).to.be.ascendingBy("votes");
            });
        });
        it("array within GET can be sorted by author in ascending order", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author&order=asc")
            .then(({ body }) => {
              expect(body.comments).to.be.ascendingBy("author");
            });
        });
        it("when given invalid order, defaults to descending", () => {
          return request(app)
            .get("/api/articles/1/comments?order=toptobottom")
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
            });
        });
        it("when given invalid column to sort by, reverts to default sorting", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=fruitiness")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
            });
        });
      });
      describe("POST", () => {
        it("POST returns 201 and a JSON object", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              username: "butter_bridge",
              body: "I don't have a great deal to say on this topic"
            })
            .expect(201)
            .expect("Content-type", "application/json; charset=utf-8")
            .then(({ body }) => {
              expect(body).to.be.an("object");
            });
        });
        it("POST returns object with correct keys and content", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              username: "butter_bridge",
              body: "Test comment"
            })
            .then(({ body }) => {
              expect(body.comment).to.have.keys(
                "comment_id",
                "author",
                "article_id",
                "body",
                "votes",
                "created_at"
              );
              expect(body.comment.body).to.equal("Test comment");
            });
        });
        it("POST returns 404 if non-existent article_id is specified", () => {
          return request(app)
            .post("/api/articles/32414/comments")
            .send({
              username: "butter_bridge",
              body: "Test comment"
            })
            .expect(404)
            .then(({ error }) => {
              expect(error.text).to.equal("Not found");
            });
        });
        it("POST returns 400 if request object is malformed or incomplete", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              scribe: "butter_bridge",
              bodaaaaaay: "Test comment"
            })
            .expect(400)
            .then(({ error }) => {
              expect(error.text).to.equal("Invalid syntax");
            });
        });
        it("POST returns 401 if username does not exist", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              username: "mr_f",
              body: "Suspicious comment"
            })
            .expect(401)
            .then(({ error }) => {
              expect(error.text).to.equal("Unauthorised operation");
            });
        });
      });
      describe("DELETE", () => {
        it("DELETE successfully removes article and returns an empty body", () => {
          return request(app)
            .delete("/api/articles/1")
            .expect(204)
            .then(({ body }) => {
              expect(body).to.deep.equal({});
            });
        });
        it("DELETE returns 400 when given an invalid comment id", () => {
          return request(app)
            .delete("/api/articles/potato")
            .expect(400)
            .then(({ error }) => {
              expect(error.text).to.equal("Invalid syntax");
            });
        });
        it("DELETE returns 404 when given a valid but non-existent comment id", () => {
          return request(app)
            .delete("/api/articles/129387")
            .expect(404)
            .then(({ error }) => {
              expect(error.text).to.equal("Not found");
            });
        });
      });
    });
  });
  describe("/comments/:comment_id", () => {
    describe("PATCH", () => {
      it("PATCH succesfully increases the number of votes for a comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an("object");
            expect(body.comment.votes).to.equal(17);
          });
      });
      it("PATCH successfully decrements the number of votes for a comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an("object");
            expect(body.comment.votes).to.equal(15);
          });
      });
      it("PATCH returns 404 when given a non-existent comment_id", () => {
        return request(app)
          .patch("/api/comments/10002")
          .send({ inc_votes: 2 })
          .expect(404)
          .then(({ error }) => {
            expect(error.text).to.equal("Not found");
          });
      });
      it("PATCH returns 400 when given an invalid comment_id", () => {
        return request(app)
          .patch("/api/comments/salacious_comment")
          .send({ inc_votes: 2 })
          .expect(400)
          .then(({ error }) => {
            expect(error.text).to.equal("Invalid syntax");
          });
      });
      it("PATCH returns 200 when given an incomplete or malformed request, and does not increment votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ increaseTheVotes: 2 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(16);
          });
      });
    });
    describe("DELETE", () => {
      it("DELETE successfully removes comment and returns an empty body", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(({ body }) => {
            expect(body).to.deep.equal({});
          });
      });
      it("DELETE returns 400 when given an invalid comment id", () => {
        return request(app)
          .delete("/api/comments/nonsense")
          .expect(400)
          .then(({ error }) => {
            expect(error.text).to.equal("Invalid syntax");
          });
      });
      it("DELETE returns 404 when given a valid but non-existent comment id", () => {
        return request(app)
          .delete("/api/comments/1395431")
          .expect(404)
          .then(({ error }) => {
            expect(error.text).to.equal("Not found");
          });
      });
    });
  });
});
