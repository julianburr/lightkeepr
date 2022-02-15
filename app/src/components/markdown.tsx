import { ComponentProps } from "react";
import Linkify from "react-linkify";
import ReactMarkdown from "react-markdown";
import externalLinks from "rehype-external-links";

import { CodePreview } from "src/components/code-preview";
import { Heading } from "src/components/mdx/heading";
import { Hr } from "src/components/mdx/hr";
import { Image } from "src/components/mdx/image";
import { Mention } from "src/components/mention";

const components = {
  img: Image,
  hr: Hr,
  h1: (props: any) => <Heading level={1} {...props} />,
  h2: (props: any) => <Heading level={2} {...props} />,
  h3: (props: any) => <Heading level={3} {...props} />,
  h4: (props: any) => <Heading level={4} {...props} />,
  code: (props: any) => {
    if (props.inline) {
      return <code {...props} />;
    }
    return (
      <CodePreview
        code={[
          {
            code: String(props.children),
            language: props.className?.match?.(/^language-(.+)$/)?.[1],
          },
        ]}
      />
    );
  },
  a: (props: any) => {
    if (props.href?.startsWith("#mention_")) {
      return <Mention>{props.children}</Mention>;
    }
    return <a {...props} />;
  },
  p: (props: any) => (
    <Linkify
      componentDecorator={(href, text) => (
        <a href={href} target="_blank" rel="nofollow noreferrer">
          {text}
        </a>
      )}
    >
      <p {...props} />
    </Linkify>
  ),
};

export function Markdown(props: ComponentProps<typeof ReactMarkdown>) {
  return (
    <ReactMarkdown
      {...props}
      components={components}
      rehypePlugins={[externalLinks]}
    />
  );
}
