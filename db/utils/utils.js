exports.formatDates = list => {
  return list.map(object => {
    object.created_at = this.formatDate(object.created_at);
    return object;
  });
};

exports.formatDate = timestamp => {
  return new Date(timestamp)
    .toISOString()
    .split("T")
    .join(" ")
    .slice(0, -1);
};

exports.makeRefObj = (list, key, value) => {
  return list.reduce((refObj, currObj) => {
    refObj[currObj[key]] = currObj[value];
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    comment.author = comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    delete comment.created_by;
    return comment;
  });
};
