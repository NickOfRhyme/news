const {
  updateCommentById,
  removeCommentById
} = require("../models/comments.model");

const patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateCommentById(comment_id, inc_votes)
    .then(([comment]) => {
      res.send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { patchCommentById, deleteCommentById };
