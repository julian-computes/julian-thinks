import test from "node:test";
import assert from "node:assert/strict";
import {
  buildFrontmatter,
  buildPostFileName,
  createNewPostPlan,
  getNextIndex,
  parsePostIndex,
  toDateDir,
  toDisplayTitle,
} from "../scripts/new-post-core.js";

test("toDateDir formats as YYYY/MM/DD", () => {
  const result = toDateDir(new Date("2026-02-16T12:00:00Z"));
  assert.equal(result, "2026/02/16");
});

test("toDisplayTitle replaces hyphens with spaces", () => {
  assert.equal(toDisplayTitle("starting-a-blog"), "starting a blog");
});

test("parsePostIndex parses index from N-slug markdown files", () => {
  assert.equal(parsePostIndex("3-starting-a-blog.md"), 3);
  assert.equal(parsePostIndex("4-next.mdx"), 4);
  assert.equal(parsePostIndex("a-bad.md"), null);
  assert.equal(parsePostIndex("2-note.txt"), null);
});

test("getNextIndex returns max index plus one", () => {
  const next = getNextIndex([
    "0-starting-a-blog.md",
    "3-third.mdx",
    "a-ignore.md",
  ]);

  assert.equal(next, 4);
});

test("buildPostFileName returns expected output", () => {
  const result = buildPostFileName({
    index: 2,
    slug: "new-post",
  });
  assert.equal(result, "2-new-post.md");
});

test("buildFrontmatter creates stable frontmatter block", () => {
  const result = buildFrontmatter({
    title: "starting a blog",
  });

  assert.equal(
    result,
    [
      "---",
      "title: 'starting a blog'",
      "description: 'Lorem ipsum dolor sit amet'",
      "---",
      "",
    ].join("\n"),
  );
});

test("createNewPostPlan combines pure pieces into a deterministic plan", () => {
  const plan = createNewPostPlan({
    slug: "starting-a-blog",
    existingFileNames: ["0-hello.md", "1-world.mdx"],
    now: new Date("2026-02-16T12:00:00Z"),
  });

  assert.equal(plan.dateDir, "2026/02/16");
  assert.equal(plan.index, 2);
  assert.equal(plan.title, "starting a blog");
  assert.equal(plan.fileName, "2-starting-a-blog.md");
  assert.equal(plan.filePath, "src/content/blog/2026/02/16/2-starting-a-blog.md");
  assert.match(plan.content, /^---\n/);
});
