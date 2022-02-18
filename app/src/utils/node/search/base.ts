import * as fs from "fs";

import matter from "gray-matter";
import lunr from "lunr";
import { remark } from "remark";
import strip from "remark-plain-text";

import { env } from "src/env";

function parseMdx(content: string): Promise<string> {
  return new Promise((yay, nay) => {
    remark()
      .use(strip)
      .process(content, function (err, file) {
        if (err) {
          return nay(err);
        }
        yay(String(file));
      });
  });
}

function prepTerms(terms: string[]): string {
  return terms
    .map((t) => {
      const exceptions = ["*", "~", "+"];
      let finalTerm = t;
      if (!exceptions.includes(finalTerm[0])) {
        finalTerm = `*${finalTerm}`;
      }
      if (!exceptions.includes(finalTerm[finalTerm.length - 1])) {
        finalTerm = `${finalTerm}*`;
      }
      return finalTerm;
    })
    .join(" ");
}

type Cache = {
  [key: string]: any;
};

const cache: Cache = {};

export async function search(
  id: string,
  files: { filePath: string; slug: string[]; absPath: string }[],
  searchTerm: string
) {
  const terms =
    searchTerm?.split?.(" ")?.filter?.((str) => !!str?.trim?.()) || [];

  // Bail if the search term is empty
  if (!terms?.length) {
    return [];
  }

  // If search index has already been created, use the existing index
  // to just do the search
  const fromCache = cache[id];
  if (
    fromCache?.searchIndex &&
    fromCache.searchIndex.hash === process.env.RELEASE_HASH
  ) {
    return fromCache.searchIndex
      .search(prepTerms(terms))
      .map((result: any) => ({
        ...result,
        data: fromCache?.searchData?.find(
          (data: any) => data.slug === result.ref
        ),
      }));
  }

  const searchData: any[] = [];

  for (const file of files) {
    if (fs.existsSync(file.absPath)) {
      const fileContent = fs.readFileSync(file.absPath);
      const { data, content } = matter(fileContent);

      const headings = content
        .split("\n")
        .reduce<string[]>((all, line) => {
          const lineMatch = line.match(/^([#]+) ([^\n]*)/);
          if (lineMatch?.[2]) {
            all.push(lineMatch[2]);
          }
          return all;
        }, [])
        .join(" -- ");

      const text = await parseMdx(content);
      const slug = file?.slug?.join("/");

      // Add content itself to search
      searchData.push({
        slug,
        title: data.title,
        headings: headings,
        text: text,
        href: `/docs/${slug}#:~:text=${encodeURIComponent(searchTerm)}`,
      });
    }
  }

  const searchIndex: any = lunr(function () {
    this.ref("slug");

    this.field("title", { boost: 20 });
    this.field("headings", { boost: 10 });
    this.field("text");

    searchData.forEach((data) => {
      this.add(data);
    });
  });

  searchIndex.hash = env.releaseHash;

  cache[id] = cache[id] || {};
  cache[id].searchIndex = searchIndex;
  cache[id].searchData = searchData;

  return searchIndex.search(prepTerms(terms)).map((result: any) => ({
    ...result,
    data: searchData?.find((data: any) => data.slug === result.ref),
  }));
}
