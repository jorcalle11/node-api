const fs = require("fs").promises;
const db = require("./pool");

const versionRegex = /^(\d{4}-\d{2}-\d{2}-\d{3})/;
const migrationsDir = __dirname + "/migrations";
const initialVersion = "2025-09-30-001";
const initFile = `${initialVersion}-initial-schema.sql`;

runMigrations()
  .then(async () => {
    console.log("Migrations completed.");
    return db.closePool();
  })
  .catch(async (err) => {
    console.error("Migration error:", err);
    return db.closePool();
  });

async function runMigrations() {
  await db.createPool({ multipleStatements: true });

  // Check if the schema_migrations table exists
  const informationResult = await db.query(
    'SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = "schema_migrations"',
    [process.env.DB_NAME]
  );

  if (informationResult.rows.length === 0) {
    console.log(
      "schema_migrations table does not exist. Running initial migration."
    );
    const initFilePath = `${migrationsDir}/${initFile}`;
    const initFileContent = await fs.readFile(initFilePath, "utf8");
    const initResult = await db.query(initFileContent);
    console.log("Initial migration file executed successfully:", initResult);
    return;
  }

  // get latest migration version
  const { rows } = await db.query(
    "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1"
  );
  const latestMigrationVersionOnDB = rows?.[0]?.version;
  console.log("Latest migration version in DB:", latestMigrationVersionOnDB);

  if (!latestMigrationVersionOnDB) {
    throw new Error("No migration version found in schema_migrations table.");
  }

  // read migration files
  const files = await fs.readdir(migrationsDir);
  let migrationFiles = files.filter((file) => versionRegex.test(file)).sort();

  const latestFileAppliedIndex = migrationFiles.findIndex((file) => {
    const match = file.match(versionRegex);
    return match && match[1] === latestMigrationVersionOnDB;
  });

  if (latestFileAppliedIndex === -1) {
    throw new Error(
      `Latest migration version ${latestMigrationVersionOnDB} not found in migration files.`
    );
  }
  const latestFileApplied = migrationFiles[latestFileAppliedIndex];
  console.log("Latest migration file applied:", latestFileApplied);

  const pendingMigrations = migrationFiles.slice(latestFileAppliedIndex + 1);
  if (pendingMigrations.length === 0) {
    console.log("No new migrations to apply.");
    return;
  }

  console.log("Pending migrations to apply:", pendingMigrations);
  const dbConnection = await db.getConnection();

  for (const file of pendingMigrations) {
    const filePath = `${migrationsDir}/${file}`;
    const fileContent = await fs.readFile(filePath, "utf8");
    const version = file.match(versionRegex)[1];
    console.log(`Applying migration: ${file}`);

    try {
      await dbConnection.beginTransaction();
      await dbConnection.query(fileContent);
      await dbConnection.query(
        "INSERT INTO schema_migrations (version, applied_by) VALUES (?, ?)",
        [version, __filename]
      );
      await dbConnection.commit();
      console.log(`Migration ${file} applied successfully.`);
    } catch (err) {
      await dbConnection.rollback();
      console.error(`Error applying migration ${file}:`, err);
      throw err;
    }
  }

  return pendingMigrations;
}
