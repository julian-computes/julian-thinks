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

export function toDatePrefix(date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toPubDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function toDisplayTitle(slug) {
  return slug.replaceAll("-", " ");
}

export function isMarkdownPostFile(fileName) {
  return fileName.endsWith(".md") || fileName.endsWith(".mdx");
}

export function parsePostIndex(fileName, datePrefix) {
  if (!isMarkdownPostFile(fileName)) {
    return null;
  }

  if (!fileName.startsWith(`${datePrefix}-`)) {
    return null;
  }

  const rest = fileName.slice(`${datePrefix}-`.length);
  const [indexPart] = rest.split("-", 1);

  if (!/^\d+$/.test(indexPart)) {
    return null;
  }

  return Number(indexPart);
}

export function getNextIndex(fileNames, datePrefix) {
  const maxIndex = fileNames.reduce((max, fileName) => {
    const index = parsePostIndex(fileName, datePrefix);
    return index === null ? max : Math.max(max, index);
  }, -1);

  return maxIndex + 1;
}

export function buildPostFileName({ datePrefix, index, slug }) {
  return `${datePrefix}-${index}-${slug}.md`;
}

export function buildPostPath({
  directory = BLOG_DIR,
  datePrefix,
  index,
  slug,
}) {
  return path.join(directory, buildPostFileName({ datePrefix, index, slug }));
}

export function buildFrontmatter({
  title,
  pubDate,
  description = DEFAULT_DESCRIPTION,
}) {
  return [
    "---",
    `title: '${title}'`,
    `description: '${description}'`,
    `pubDate: '${pubDate}'`,
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
  const datePrefix = toDatePrefix(now);
  const pubDate = toPubDate(now);
  const index = getNextIndex(existingFileNames, datePrefix);
  const title = toDisplayTitle(slug);
  const fileName = buildPostFileName({ datePrefix, index, slug });
  const filePath = path.join(directory, fileName);
  const content = buildFrontmatter({ title, pubDate });

  return {
    datePrefix,
    pubDate,
    index,
    title,
    fileName,
    filePath,
    content,
  };
}
