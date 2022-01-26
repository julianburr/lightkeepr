import { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import externalLinks from "rehype-external-links";

export function Markdown(props: ComponentProps<typeof ReactMarkdown>) {
  return <ReactMarkdown {...props} rehypePlugins={[externalLinks]} />;
}
