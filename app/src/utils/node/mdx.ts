import * as path from "path";

import matter from "gray-matter";
import getReadingTime from "reading-time";
import remarkCopyLinkedFiles from "remark-copy-linked-files";
import remarkParse from "remark-parse";
import remarkSmartypants from "remark-smartypants";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

export async function parseMdx(mdxString: string) {
  const { data, content } = matter(mdxString);
  const readingTime = getReadingTime(mdxString);

  const parsed = await unified()
    .use(remarkParse)
    .use(remarkSmartypants)
    .use(remarkCopyLinkedFiles, {
      destinationDir: path.resolve(process.cwd(), "./public"),
    })
    .use(remarkStringify)
    .process(content);

  const markdown = parsed.toString();

  return {
    meta: {
      ...data,
      readingTime,
    },
    markdown,
  };
}
