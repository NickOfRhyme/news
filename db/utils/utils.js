exports.formatDates = list => {
  return list.map(obj => {
    return { ...obj, created_at: new Date(obj.created_at) };
  });
};

exports.makeRefObj = (list, key, value) => {
  return list.reduce((refObj, currObj) => {
    refObj[currObj[key]] = currObj[value];
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const formattedComment = { ...comment };
    formattedComment.author = comment.created_by;
    formattedComment.article_id = articleRef[comment.belongs_to];
    delete formattedComment.belongs_to;
    delete formattedComment.created_by;
    return formattedComment;
  });
};
