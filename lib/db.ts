import "dotenv/config";
import { Pool } from "pg";

// Buat pool koneksi PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER ?? "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  database: process.env.POSTGRES_DB ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "",
  port: parseInt(process.env.POSTGRES_PORT ?? "5432", 10),
});

// Opsional: cek koneksi di awal
pool.connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    client.release(); // jangan lupa release biar pool tetap bersih
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
  });

export default pool;
