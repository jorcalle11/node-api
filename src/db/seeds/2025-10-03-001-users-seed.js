const logger = require("../../logger")("seeds:users");
const bcrypt = require("bcrypt");

async function getUsers() {
  const API = "https://jsonplaceholder.typicode.com/users";
  logger.info("Fetching users from external API:", API);

  const response = await fetch(API);
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
}

function hashPassword(plainPassword) {
  const saltRounds = 10;
  const secretKey = process.env.PASSWORD_SECRET || "secret";
  const password = [secretKey, plainPassword].join("_");
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
}

async function insertUsers(db) {
  logger.info("Seeding users...");
  const query =
    "INSERT INTO users (id, username, email, password_hash) VALUES ? ON DUPLICATE KEY UPDATE username=VALUES(username), email=VALUES(email), password_hash=VALUES(password_hash);";

  const users = await getUsers();
  logger.info("Fetched users:", users.length);

  const values = users.map((user) => [
    user.id,
    user.username,
    user.email,
    hashPassword(user.username),
  ]);
  await db.query(query, [values]);
}

module.exports = {
  insert: insertUsers,
};
