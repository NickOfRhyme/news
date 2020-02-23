# Nick's Breaking News API

An api for interacting with a reddit-style news database.

You can access a hosted version [here](https://nicks-breaking-news.herokuapp.com/api).

Features the following endpoints:

#### /api

- GET a json representation of all available endpoints

#### /api/topics

- GET a list of topics

#### /api/users/:username

- GET information about a particular user

#### /api/articles

- GET a list of all posted articles, which can be sorted by date, topic, votes, title, article_id and author

#### /api/articles/:article_id

- GET information about a particular article, including its body
- PATCH in order to vote a particular article up or down

#### /api/articles/:article_id/comments

- GET a list of comments, which can be sorted by date, votes, author, and comment_id
- POST a new comment on an already existing article

#### /api/comments/:comment_id

- PATCH in order to vote a particular article up or down
- DELETE a comment

## Getting Started

### Requirements

Nick's Breaking News API is built with:

- postgreSQL
- node.js version 12.12.0
- express version 4.17.1
- knex version 0.20.8
- node-postgres version 7.18.1

For testing:

- chai version 4.2.0
- sams-chai-sorted version 1.0.2
- mocha version 7.0.1
- supertest version 4.0.2

### Installation

First, make sure that you have [node](http://nodejs.org) and [postgreSQL](https://www.postgresql.org) installed on your system. If you are using ubuntu, postgreSQL should be installed by default.

Next, clone the repo to your hard drive by navigating to an appropriate directory in your terminal and typing `git clone https://github.com/NickOfRhyme/news`

You'll then need to install the various dependencies: `npm i express knex pg`

If you want to run the test suite in the spec folder, you'll also need to type `npm i -D mocha chai supertest sams-chai-sorted` (the -D indicates that these are development dependencies).

### Setup

In the root directory of the project, you'll need to create 'knexfile.js', which should have the following contents:

```
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: "nc_news",
      user: "YOUR_PSQL_USERNAME",
      password: "YOUR_PSQL_PASSWORD"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      user: "YOUR_PSQL_USERNAME",
      password: "YOUR_PSQL_PASSWORD"
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

```

If you are using a mac, you can remove both sets of 'user' and 'password' keys.

You now need to setup the databases by typing the following commands

```
npm run setup-dbs
npm run seed
```

## Test suite

There are two sets of tests. The first is for the utility functions, which can be run by typing:

```
npm run test-utils
```

There is also a set of tests for the server app itself, which can be run by just typing:

```
npm t
```

The tests all use [mocha](https://www.mochajs.org) as their test framework, along with [chai](https://www.chaijs.com) (extendend with [sams-chai-sorted](https://www.npmjs.com/package/sams-chai-sorted)) as an assertion library. In addition, the server tests use [supertest](https://www.npmjs.com/package/supertest) in order to make http assertions.

## Starting up the server

Everything should now be ready for you to start up your server! Just type:

```
npm start
```

If all goes well, you should get the message

```
listening on port 9090...
```

and you can start making requests!
