/**
 * Generate a bcrypt hash for the admin password.
 * Usage: npx tsx scripts/hash-password.mts yourpassword
 *
 * Copy the output into ADMIN_PASSWORD_HASH in your .env
 * On macOS/Linux escape each $ with \$ when setting in .env:
 *   ADMIN_PASSWORD_HASH=\$2b\$12\$...
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.mts <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nAdd to .env (escape each $ with \\$):");
console.log(`ADMIN_PASSWORD_HASH=${hash.replaceAll("$", "\\$")}`);
console.log("\nRaw hash (for Vercel dashboard — paste as-is):");
console.log(hash);
