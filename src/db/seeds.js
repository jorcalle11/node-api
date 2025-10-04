const fs = require("fs").promises;
const db = require("./pool");
const logger = require("../logger")("seeds");

const seedsDir = __dirname + "/seeds";
const versionRegex = /^(\d{4}-\d{2}-\d{2}-\d{3})/;

runSeeds()
  .then(async () => {
    logger.info("Seeding completed.");
    return db.closePool();
  })
  .catch(async (err) => {
    logger.error("Seeding error:", err);
    return db.closePool();
  });

async function runSeeds() {
  await db.createPool({ multipleStatements: true });

  // read seed files
  const files = await fs.readdir(seedsDir);
  let seedFiles = files.filter((file) => versionRegex.test(file)).sort();

  for (const file of seedFiles) {
    const filePath = `${seedsDir}/${file}`;
    logger.log("Running seed file:", filePath);
    const seedModule = require(filePath);

    if (typeof seedModule.insert === "function") {
      await seedModule.insert(db);
      logger.log(`Seed file ${file} executed successfully.`);
    } else {
      logger.warn(`Seed file ${file} does not export an insert function.`);
    }
  }
}
