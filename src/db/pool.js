const logger = require("../logger")("db-pool");
const mysql = require("mysql2/promise");
let pool;

function checkEnvVariables() {
  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      logger.error(`Environment variable ${varName} is required but not set.`);
      throw new Error(
        `Environment variable ${varName} is required but not set.`
      );
    }
  });
}

function createPool(options = {}) {
  checkEnvVariables();
  logger.info("Initializing database pool...", options);

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

  logger.info("Getting database connection...");
  return pool.getConnection();
}

async function query(sql, values) {
  const connection = await getConnection();
  logger.info("query:", sql, values);

  const [rows, fields] = await connection.query(sql, values);
  connection.release();
  return { rows, fields };
}

async function execute(sql, values) {
  const connection = await getConnection();
  logger.info("Execute:", sql, values);

  const [rows, fields] = await connection.execute(sql, values);
  connection.release();
  return { rows, fields };
}

async function closePool() {
  if (!pool) {
    return;
  }

  logger.info("Closing database pool...");
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
