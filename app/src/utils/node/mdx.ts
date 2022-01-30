import * as path from "path";
import matter from "gray-matter";
import getReadingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import smartypants from "remark-smartypants";
import copyLinkedFiles from "remark-copy-linked-files";
import externalLinks from "rehype-external-links";
import slug from "rehype-slug";
import autolinkHeadings from "rehype-autolink-headings";

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
