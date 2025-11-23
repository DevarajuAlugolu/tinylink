import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";

import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = __dirname;
const sqlFiles = fs
  .readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set. Set it in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    for (const f of sqlFiles) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f), "utf8");
      console.log("Running", f);
      await pool.query(sql);
    }
    console.log("Migrations complete");
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.error("Migration error", e);
    await pool.end();
    process.exit(1);
  }
})();
