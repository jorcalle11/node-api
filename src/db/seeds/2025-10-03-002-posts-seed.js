const logger = require("../../logger")("seeds:posts");

async function getPosts() {
  const API = "https://jsonplaceholder.typicode.com/posts";
  logger.info("Fetching posts from external API:", API);

  const response = await fetch(API);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  return response.json();
}

async function insertPosts(db) {
  logger.info("Seeding posts...");

  const query =
    "INSERT INTO posts (id, title, content, user_id) VALUES ? ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), user_id=VALUES(user_id);";

  const posts = await getPosts();
  logger.info("Fetched posts:", posts.length);

  const values = posts.map((post) => [
    post.id,
    post.title,
    post.body,
    post.userId,
  ]);
  await db.query(query, [values]);
}

module.exports = {
  insert: insertPosts,
};
