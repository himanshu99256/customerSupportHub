/**
 * Test database connection script
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import { testConnection } from "../lib/db";

async function main() {
  console.log("Testing database connection...");
  const connected = await testConnection();
  
  if (connected) {
    console.log("✅ Database connection successful!");
    process.exit(0);
  } else {
    console.error("❌ Database connection failed!");
    console.error("Please check your .env file and ensure MySQL is running.");
    process.exit(1);
  }
}

main();

