#!/usr/bin/env node
/**
 * Creates a new blog post file in the src/content/blog directory.
 *
 * Usage:
 * node scripts/new-post.js <slug>
 *
 * Example:
 * node scripts/new-post.js starting-a-blog
 */
import fs from "node:fs/promises";
import path from "node:path";
import {
  BLOG_DIR,
  createNewPostPlan,
} from "./new-post-core.js";

export async function listExistingFileNames(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function writeNewPostFile(filePath, content) {
  await fs.writeFile(filePath, content, { encoding: "utf8", flag: "wx" });
}

export async function run(argv) {
  const slug = argv[2];
  if (!slug) {
    throw new Error("Usage: node scripts/new-post.js <slug>");
  }

  await fs.mkdir(BLOG_DIR, { recursive: true });
  const existingFileNames = await listExistingFileNames(BLOG_DIR);
  const plan = createNewPostPlan({ slug, existingFileNames });
  const targetPath = path.resolve(plan.filePath);

  await writeNewPostFile(targetPath, plan.content);
  return plan.filePath;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run(process.argv)
    .then((createdPath) => {
      console.log(`Created ${createdPath}`);
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
