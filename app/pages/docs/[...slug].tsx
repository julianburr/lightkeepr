import * as fs from "fs";
import * as path from "path";
import glob from "glob";
import twemoji from "twemoji";
import { useRef, Ref, useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";

import { DocsLayout } from "src/layouts/docs";
import { parseMdx } from "src/utils/node/mdx";

const Container = styled.main`
  width: 100%;

  h1,
  h2,
  h3,
  h4 {
    line-height: 1.1;
  }

  h2 {
    margin: 3.2rem 0 0;
  }

  h3 {
    margin: 2.4rem 0 -0.8rem;
  }

  h2,
  h3,
  h4 {
    position: relative;

    a[aria-hidden="true"] {
      position: absolute;
      right: 100%;
      padding: 0.1em 0.6rem 0 0;
      opacity: 0;
      transition: opacity 0.2s;

      &:before {
        content: "#";
      }
    }

    &:hover a[aria-hidden="true"] {
      opacity: 1;
      text-decoration: none;
    }
  }

  ul li {
    margin: 1.2rem 0;
  }
`;

const components = {};

export default function DocsHomePage({ meta, source }: any) {
  const contentRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (contentRef.current) {
      twemoji.parse(contentRef.current as any, {
        ext: ".svg",
        size: "svg",
      });
    }
  }, []);

  return (
    <DocsLayout>
      <Head>
        <title>
          Lightkeepr Docs —
          {meta.category
            ? ` ${meta.category} — ${meta.title}`
            : ` ${meta.title}`}
        </title>
      </Head>

      <Container ref={contentRef as Ref<HTMLDivElement>}>
        <h1>{meta.title}</h1>
        <MDXRemote {...source} components={components} />
      </Container>
    </DocsLayout>
  );
}

export async function getStaticProps({ params }: any) {
  const docsDir = path.resolve(process.cwd(), "../docs");

  const relPath = params.slug.join("/");
  const filePath = fs.existsSync(path.resolve(docsDir, `${relPath}.md`))
    ? path.resolve(docsDir, `${relPath}.md`)
    : fs.existsSync(path.resolve(docsDir, `${relPath}/index.md`))
    ? path.resolve(docsDir, `${relPath}/index.md`)
    : null;

  if (!filePath) {
    return { props: {} };
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { meta, source } = await parseMdx(fileContent);

  return { props: { meta, source } };
}

export async function getStaticPaths() {
  const docsDir = path.resolve(process.cwd(), "../docs");

  const docs = glob
    .sync("**/*.md", { cwd: docsDir })
    .filter((path) => path !== "__menu.md" && !path.endsWith("/__menu.md"));
  const paths = docs.map((path) => ({
    params: {
      slug: path
        .replace(/^index\.md$/, "")
        .replace(/\.md$/, "")
        .split("/"),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
