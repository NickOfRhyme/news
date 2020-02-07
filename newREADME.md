#Nick's Breaking News API

An api for interacting with a reddit-style news database.

Features the following endpoints: 

####/api
- GET a json representation of all available endpoints

####/api/topics
- GET a list of topics

####/api/users/:username
- GET information about a particular user

####/api/articles
- GET a list of all posted articles, which can be sorted by date, topic, votes, title, article_id and author

####/api/articles/:article_id
- GET information about a particular article, including its body
- PATCH in order to vote a particular article up or down

####/api/articles/:article_id/comments
- GET a list of comments, which can be sorted by date, votes, author, and comment_id
- POST a new comment on an already existing article

####/api/comments/:comment_id
- PATCH in order to vote a particular article up or down
- DELETE a comment

##Getting Started

###Requirements

Nick's Breaking News API is built with:
- node.js version 12.12.0
- express version 4.17.1
- knex version 0.20.8
- PSQL version 
- postgres version 7.18.1

For testing:
- chai version 4.2.0
- sams-chai-sorted version 1.0.2
- mocha version 7.0.1
- supertest version 4.0.2


###Installation

First, make sure that you have node installed on your system.

Next, clone the repo to your hard drive by navigating to an appropriate directory in your terminal and typing `git clone https://github.com/NickOfRhyme/news`

You'll then need to install the various dependencies: `npm i express knex pg`

If you want to run the test suite in the spec folder, you'll also need to type `npm i -D mocha chai supertest sams-chai-sorted` (the -D indicates that these are dev dependencies).

Next, you'll need to create a knex file, with the following