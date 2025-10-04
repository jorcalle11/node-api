const logger = require("../../logger")("seeds:posts");

async function getComments() {
  const API = "https://jsonplaceholder.typicode.com/comments";
  logger.info("Fetching comments from external API:", API);

  const response = await fetch(API);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  return response.json();
}

async function insertComments(db) {
  logger.info("Seeding comments...");

  const query =
    "INSERT INTO comments (id, content, post_id, user_id) VALUES ? ON DUPLICATE KEY UPDATE content=VALUES(content), post_id=VALUES(post_id), user_id=VALUES(user_id);";

  const comments = await getComments();
  logger.info("Fetched comments:", comments.length);

  const values = comments.map((comment) => [
    comment.id,
    comment.body,
    comment.postId,
    // randomly assign userId between 1 and 10
    Math.floor(Math.random() * 10) + 1,
  ]);
  await db.query(query, [values]);
}

module.exports = {
  insert: insertComments,
};
