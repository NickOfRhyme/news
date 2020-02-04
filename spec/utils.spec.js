const { expect } = require("chai");
const {
  formatDates,
  formatDate,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an array", () => {
    const input = [];
    const actual = formatDates(input);
    expect(actual).to.be.an("array");
  });
  it("returns a new array", () => {
    const input = [];
    const actual = formatDates(input);
    const unexpected = input;
    expect(actual).to.not.equal(unexpected);
  });
  it("correctly converts a timestamp within a single object within an array", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate objects within input array", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const unalteredInput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    formatDates(input);
    expect(input).to.deep.equal(unalteredInput);
  });
});

describe("makeRefObj", () => {
  it("returns an object", () => {
    expect(makeRefObj([])).to.be.an("object");
  });
  it("when given a single input object, correctly returns the desired key-value pair", () => {
    const input = [{ a: "two", b: 2 }];
    const actual = makeRefObj(input, "a", "b");
    const expected = { two: 2 };
    expect(actual).to.deep.equal(expected);
  });
  it("when given an array of several objects, correctly returns a full reference object", () => {
    const input = [
      { a: "two", b: 2 },
      { a: "four", b: 4 },
      { a: "six", b: 6 }
    ];
    const actual = makeRefObj(input, "a", "b");
    const expected = { two: 2, four: 4, six: 6 };
    expect(actual).to.deep.equal(expected);
  });
});

describe("formatComments", () => {
  it("returns an array", () => {
    expect(formatComments([])).to.be.an("array");
  });
  it("returns a new array", () => {
    const input = [];
    const actual = formatComments(input);
    const unexpected = input;
    expect(actual).to.not.equal(unexpected);
  });
  it("succesfully reformats a single comment", () => {
    const refObj = { what: "that" };
    const input = [{ belongs_to: "what", created_by: "Jeff" }];
    const actual = formatComments(input, refObj);
    const expected = [{ article_id: "that", author: "Jeff" }];
    expect(actual).to.deep.equal(expected);
  });
  it("successfully reformats a series of comments", () => {
    const refObj = { "lots of text": 1, "very little text": 2 };
    const input = [
      { belongs_to: "lots of text", created_by: "Bob" },
      { belongs_to: "lots of text", created_by: "Bob" },
      { belongs_to: "very little text", created_by: "Bob" },
      { belongs_to: "lots of text", created_by: "Bob" }
    ];
    const expected = [
      { article_id: 1, author: "Bob" },
      { article_id: 1, author: "Bob" },
      { article_id: 2, author: "Bob" },
      { article_id: 1, author: "Bob" }
    ];
    const actual = formatComments(input, refObj);

    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate original array or its contents", () => {
    const refObj = { "lots of text": 1, "very little text": 2 };
    const untouchedInput = [
      { belongs_to: "lots of text" },
      { belongs_to: "lots of text" },
      { belongs_to: "very little text" },
      { belongs_to: "lots of text" }
    ];
    const input = [
      { belongs_to: "lots of text" },
      { belongs_to: "lots of text" },
      { belongs_to: "very little text" },
      { belongs_to: "lots of text" }
    ];
    formatComments(input, refObj);
    expect(input).to.deep.equal(untouchedInput);
  });
});
