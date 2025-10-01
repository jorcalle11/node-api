const db = require("./pool");

runMigrations()
  .then(() => console.log("Migrations completed."))
  .catch((err) => console.error("Migration error:", err))
  .finally(() => db.closePool());

async function runMigrations() {
  const response = await db.query("select 1 + 1 as result");
  console.log(response);
}
