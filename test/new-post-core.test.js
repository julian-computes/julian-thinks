import test from "node:test";
import assert from "node:assert/strict";
import {
  buildFrontmatter,
  buildPostFileName,
  createNewPostPlan,
  getNextIndex,
  parsePostIndex,
  toDatePrefix,
  toDisplayTitle,
  toPubDate,
} from "../scripts/new-post-core.js";

test("toDatePrefix formats as yy-mm-dd", () => {
  const result = toDatePrefix(new Date("2026-02-16T12:00:00Z"));
  assert.equal(result, "26-02-16");
});

test("toPubDate formats as Mon dd yyyy", () => {
  const result = toPubDate(new Date("2026-02-16T12:00:00Z"));
  assert.equal(result, "Feb 16, 2026");
});

test("toDisplayTitle replaces hyphens with spaces", () => {
  assert.equal(toDisplayTitle("starting-a-blog"), "starting a blog");
});

test("parsePostIndex parses index only for matching date markdown files", () => {
  assert.equal(parsePostIndex("26-02-16-3-starting-a-blog.md", "26-02-16"), 3);
  assert.equal(parsePostIndex("26-02-16-4-next.mdx", "26-02-16"), 4);
  assert.equal(parsePostIndex("26-02-16-a-bad.md", "26-02-16"), null);
  assert.equal(parsePostIndex("26-02-15-9-older.md", "26-02-16"), null);
  assert.equal(parsePostIndex("26-02-16-2-note.txt", "26-02-16"), null);
});

test("getNextIndex returns max index plus one", () => {
  const next = getNextIndex(
    [
      "26-02-16-0-starting-a-blog.md",
      "26-02-16-3-third.mdx",
      "26-02-16-a-ignore.md",
      "other-file.md",
    ],
    "26-02-16",
  );

  assert.equal(next, 4);
});

test("buildPostFileName returns expected output", () => {
  const result = buildPostFileName({
    datePrefix: "26-02-16",
    index: 2,
    slug: "new-post",
  });
  assert.equal(result, "26-02-16-2-new-post.md");
});

test("buildFrontmatter creates stable frontmatter block", () => {
  const result = buildFrontmatter({
    title: "starting a blog",
    pubDate: "Feb 16, 2026",
  });

  assert.equal(
    result,
    [
      "---",
      "title: 'starting a blog'",
      "description: 'Lorem ipsum dolor sit amet'",
      "pubDate: 'Feb 16, 2026'",
      "---",
      "",
    ].join("\n"),
  );
});

test("createNewPostPlan combines pure pieces into a deterministic plan", () => {
  const plan = createNewPostPlan({
    slug: "starting-a-blog",
    existingFileNames: ["26-02-16-0-hello.md", "26-02-16-1-world.mdx"],
    now: new Date("2026-02-16T12:00:00Z"),
  });

  assert.equal(plan.datePrefix, "26-02-16");
  assert.equal(plan.pubDate, "Feb 16, 2026");
  assert.equal(plan.index, 2);
  assert.equal(plan.title, "starting a blog");
  assert.equal(plan.fileName, "26-02-16-2-starting-a-blog.md");
  assert.equal(plan.filePath, "src/content/blog/26-02-16-2-starting-a-blog.md");
  assert.match(plan.content, /^---\n/);
});
