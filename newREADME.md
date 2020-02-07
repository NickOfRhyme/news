#Nick's breaking news api

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