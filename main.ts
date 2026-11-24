import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_PATH = join(OUTPUT_DIR, "entry.txt");
const MAX_CHARS = 120;

// The warning label: a grandfather-paradox hazard, phrased as a deadpan
// customer-service notice. The joke is the refund policy, and it only
// lands in the last three words.
const WARNING =
  "WARNING: Do not prevent your own birth. Refunds are not available to the unborn.";

function main(): void {
  if (WARNING.length < 1 || WARNING.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} characters, got ${WARNING.length}`,
    );
  }
  // The gate rejects whitespace-only text, and a trailing newline would
  // count against the 120-character budget, so the entry ships exactly
  // as written: one line, no trailing newline.
  if (WARNING.trim() !== WARNING || WARNING.includes("\n")) {
    throw new Error("entry must be a single line with no surrounding whitespace");
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, WARNING, "utf8");

  // Read the file back and verify what landed on disk is exactly the entry.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== WARNING) {
    throw new Error("read-back mismatch: entry.txt differs from entry");
  }
  console.log(WARNING);
}

main();
