const { expect } = require("chai");
const {
  formatDates,
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
  it("correctly converts timestamps within multiple objects within arrays", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      },
      {
        body:
          "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.",
        belongs_to: "22 Amazing open source React projects",
        created_by: "grumpy19",
        votes: 3,
        created_at: 1504183900263
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: new Date(1478813209256)
      },
      {
        body:
          "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.",
        belongs_to: "22 Amazing open source React projects",
        created_by: "grumpy19",
        votes: 3,
        created_at: new Date(1504183900263)
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
