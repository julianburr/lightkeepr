import * as path from "path";

import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import getReadingTime from "reading-time";
import autolinkHeadings from "rehype-autolink-headings";
import externalLinks from "rehype-external-links";
import slug from "rehype-slug";
import copyLinkedFiles from "remark-copy-linked-files";
import smartypants from "remark-smartypants";

export async function parseMdx(mdxString: string) {
  const { data, content } = matter(mdxString);
  const readingTime = getReadingTime(mdxString);

  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        smartypants,
        [
          copyLinkedFiles,
          {
            destinationDir: path.resolve(process.cwd(), "./public"),
          },
        ],
      ],
      rehypePlugins: [
        slug,
        autolinkHeadings,
        [
          externalLinks,
          {
            target: "_blank",
            rel: ["nofollow", "noreferrer"],
          },
        ],
      ],
    },
  });

  return {
    meta: {
      ...data,
      readingTime,
    },
    source,
  };
}
