import * as fs from "fs";

import Head from "next/head";
import { useRef, Ref, useEffect } from "react";
import styled from "styled-components";
import twemoji from "twemoji";

import { Markdown } from "src/components/markdown";
import { DocsLayout } from "src/layouts/docs";
import { parseMdx } from "src/utils/node/mdx";
import { getFiles } from "src/utils/node/search/docs";

const Container = styled.main`
  width: 100%;

  h1,
  h2,
  h3,
  h4 {
    line-height: 1.1;
  }

  h1 {
    margin: 0 0 2rem 0;
  }

  h2 {
    margin: 3.8rem 0 1.6rem;
    font-size: 1.6em;
  }

  h3 {
    margin: 2.4rem 0 0.6rem;
    font-size: 1.2em;
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
    padding: 0 0 0 3.2rem;
    position: relative;

    &:before {
      content: " ";
      position: absolute;
      top: 0.7em;
      left: 0.8rem;
      width: 1.2rem;
      height: 0.15rem;
      background: currentColor;
    }
  }

  .emoji {
    height: 1.2em;
    width: auto;
    margin: -0.2rem 0.2rem 0;
    vertical-align: middle;
    display: inline-block;
  }
`;

export default function DocsHomePage({ meta, markdown }: any) {
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
            ? ` ${meta.category}: ${meta.title}`
            : ` ${meta.title}`}
        </title>
      </Head>

      <Container ref={contentRef as Ref<HTMLDivElement>}>
        <h1>{meta.title}</h1>
        <Markdown>{markdown}</Markdown>
      </Container>
    </DocsLayout>
  );
}

export async function getStaticProps({ params }: any) {
  const files = await getFiles();
  const file = files.find(
    ({ slug }) => slug?.join("/") === params.slug?.join("/")
  );

  if (!file || !fs.existsSync(file.absPath)) {
    return { props: {} };
  }

  const fileContent = fs.readFileSync(file.absPath, "utf-8");
  const { meta, markdown } = await parseMdx(fileContent);
  return { props: { meta, markdown } };
}

export async function getStaticPaths() {
  const files = await getFiles();
  return {
    paths: files.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}
