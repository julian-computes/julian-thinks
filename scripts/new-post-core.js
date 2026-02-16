/**
 * Functional core for the imperative new-post.js script.
 *
 * Usage:
 * import { createNewPostPlan } from "./new-post-core.js";
 *
 * Example:
 * const plan = createNewPostPlan({
 *   slug: "starting-a-blog",
 * });
 */
import path from "node:path";

export const BLOG_DIR = "src/content/blog";
export const DEFAULT_DESCRIPTION = "Lorem ipsum dolor sit amet";

export function toDateDir(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return path.join(year, month, day);
}

export function toDisplayTitle(slug) {
  return slug.replaceAll("-", " ");
}

export function isMarkdownPostFile(fileName) {
  return fileName.endsWith(".md") || fileName.endsWith(".mdx");
}

export function parsePostIndex(fileName) {
  if (!isMarkdownPostFile(fileName)) {
    return null;
  }

  const [indexPart] = fileName.split("-", 1);

  if (!/^\d+$/.test(indexPart)) {
    return null;
  }

  return Number(indexPart);
}

export function getNextIndex(fileNames) {
  const maxIndex = fileNames.reduce((max, fileName) => {
    const index = parsePostIndex(fileName);
    return index === null ? max : Math.max(max, index);
  }, -1);

  return maxIndex + 1;
}

export function buildPostFileName({ index, slug }) {
  return `${index}-${slug}.md`;
}

export function buildPostPath({
  directory = BLOG_DIR,
  dateDir,
  index,
  slug,
}) {
  return path.join(directory, dateDir, buildPostFileName({ index, slug }));
}

export function buildFrontmatter({
  title,
  description = DEFAULT_DESCRIPTION,
}) {
  return [
    "---",
    `title: '${title}'`,
    `description: '${description}'`,
    "---",
    "",
  ].join("\n");
}

export function createNewPostPlan({
  slug,
  existingFileNames,
  now = new Date(),
  directory = BLOG_DIR,
}) {
  const dateDir = toDateDir(now);
  const index = getNextIndex(existingFileNames);
  const title = toDisplayTitle(slug);
  const fileName = buildPostFileName({ index, slug });
  const filePath = path.join(directory, dateDir, fileName);
  const content = buildFrontmatter({ title });

  return {
    dateDir,
    index,
    title,
    fileName,
    filePath,
    content,
  };
}
