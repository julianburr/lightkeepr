import { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import externalLinks from "rehype-external-links";

import { Heading } from "src/components/mdx/heading";
import { Hr } from "src/components/mdx/hr";
import { Image } from "src/components/mdx/image";

import { CodePreview } from "./code-preview";

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
