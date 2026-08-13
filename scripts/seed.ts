/**
 * Populates initial data for every member in the fixed roster
 * (src/lib/members.ts). Safe to re-run — existing status/task values
 * are left untouched, only missing members get defaults.
 *
 * Usage: npm run seed
 */
import { SEED_MEMBERS } from "../src/lib/members";
import { isUsingRedis, seedDefaults } from "../src/lib/store";

async function main() {
  await seedDefaults();
  console.log(
    `Seed selesai untuk ${SEED_MEMBERS.length} anggota (${
      isUsingRedis() ? "Redis" : "memori lokal"
    }).`
  );
  if (!isUsingRedis()) {
    console.warn(
      "Peringatan: UPSTASH_REDIS_REST_URL/TOKEN tidak diset — data hanya tersimpan di memori proses ini dan tidak akan tersimpan."
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
