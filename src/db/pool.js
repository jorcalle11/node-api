const mysql = require("mysql2/promise");
let pool;

function checkEnvVariables() {
  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(
        `Environment variable ${varName} is required but not set.`
      );
    }
  });
}

function createPool(options = {}) {
  checkEnvVariables();
  console.log("Initializing database pool...");

  pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...options,
  });
}

async function getConnection() {
  if (!pool) {
    createPool();
  }

  console.log("Getting database connection...");
  return pool.getConnection();
}

async function query(sql, values) {
  const connection = await getConnection();
  console.log("Executing query:", sql);

  const [rows, fields] = await connection.query(sql, values);
  connection.release();
  return { rows, fields };
}

async function execute(sql, values) {
  const connection = await getConnection();
  console.log("Executing command:", sql);

  const [rows, fields] = await connection.execute(sql, values);
  connection.release();
  return { rows, fields };
}

async function closePool() {
  if (!pool) {
    return;
  }

  console.log("Closing database pool...");
  await pool.end();
  pool = null;
}

module.exports = {
  createPool,
  getConnection,
  query,
  execute,
  closePool,
};
