import classnames from "classnames";
import Prism from "prismjs";
import { useState, Fragment, useEffect } from "react";
import styled from "styled-components";

import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";
import "prismjs/plugins/line-numbers/prism-line-numbers";

import FileSvg from "src/assets/icons/file.svg";
import TerminalSvg from "src/assets/icons/terminal.svg";

import { CopyButton } from "./copy-button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  code {
    filter: grayscale(1);
    transition: filter 0.2s;
  }

  &:hover,
  &:focus-within {
    code {
      filter: grayscale(0);
    }
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.6rem;
  background: var(--sol--palette-sand-500);
  border-radius: 0.3rem 0.3rem 0 0;
  min-height: 4rem;
`;

const Tabs = styled.span`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
`;

const Tab = styled.button`
  opacity: 0.5;
  border: 0 none;
  padding: 0.4rem 0.6rem;
  font-size: 1.2rem;
  transition: opacity 0.2s;
  background: transparent;

  &:hover,
  &:focus,
  &.active {
    opacity: 1;
  }
`;

const FileTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.4rem;
  background: var(--sol--palette-sand-300);
`;

const FileName = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  opacity: 0.6;
  font-size: 1rem;
  padding: 0 0.8rem;

  svg {
    display: flex;
    height: 1.1em;
    width: auto;
    margin: 0.1rem 0.6rem 0 0;
  }
`;

const Pre = styled.pre`
  font-family: "Source Code Pro", Consolas, Monaco, "Andale Mono", "Ubuntu Mono";
  background: var(--sol--palette-sand-200);

  &:last-child {
    border-radius: 0 0 0.3rem 0.3rem;
  }

  font-size: 1.5rem;
  line-height: 1.5;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  color: #728fcb;
  padding: 1.4em;
  overflow: auto;

  &::selection {
    text-shadow: none;
    background: #faf8f5;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #b6ad9a;
  }

  .token.punctuation {
    color: #b6ad9a;
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.tag,
  .token.operator,
  .token.number {
    color: #063289;
  }

  .token.property,
  .token.function {
    color: #b29762;
  }

  .token.tag-id,
  .token.selector,
  .token.atrule-id {
    color: #2d2006;
  }

  &.language-javascript,
  .token.attr-name {
    color: #896724;
  }

  &.language-css,
  &.language-scss,
  .token.boolean,
  .token.string,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .language-scss .token.string,
  .style .token.string,
  .token.attr-value,
  .token.keyword,
  .token.control,
  .token.directive,
  .token.unit,
  .token.statement,
  .token.regex,
  .token.atrule {
    color: #728fcb;
  }

  .token.placeholder,
  .token.variable {
    color: #93abdc;
  }

  .token.deleted {
    text-decoration: line-through;
  }

  .token.inserted {
    border-bottom: 1px dotted #2d2006;
    text-decoration: none;
  }

  .token.italic {
    font-style: italic;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.important {
    color: #896724;
  }

  .token.entity {
    cursor: help;
  }

  &.line-numbers {
    position: relative;
    padding-left: 3.8em;
    counter-reset: linenumber;
  }

  &.line-numbers > code {
    position: relative;
    white-space: inherit;
  }

  &.line-numbers .line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 0;
    font-size: 100%;
    left: -3.8em;
    width: 3em; /* works for line-numbers below 1000 lines */
    letter-spacing: -1px;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    & > span {
      display: block;
      counter-increment: linenumber;

      &:before {
        content: counter(linenumber);
        color: var(--sol--palette-sand-600);
        display: block;
        padding-right: 0.8em;
        text-align: right;
      }
    }
  }
`;

type Code = {
  code: string;
  title?: string;
  language?: string;
  showLineNumbers?: boolean;
};

type CodeFiles = {
  title?: string;
  files: Code[];
};

type CodePreview = {
  code: (Code | CodeFiles)[];
};

export function CodePreview({ code }: CodePreview) {
  const [tab, setTab] = useState(0);
  const tabContent = code[tab];

  useEffect(() => {
    Prism.highlightAll();
  }, [tab, code]);

  if ("code" in tabContent) {
    return (
      <Container>
        <Title>
          <Tabs>
            {code.map((c, index) =>
              c.title ? (
                <Tab
                  key={index}
                  className={classnames({ active: index === tab })}
                  onClick={() => setTab(index)}
                >
                  {c.title}
                </Tab>
              ) : null
            )}
          </Tabs>
          <CopyButton
            size="small"
            intent="ghost"
            text={tabContent.code.trim()}
          />
        </Title>

        <Pre
          key={`code--${tab}`}
          className={classnames(`language-${tabContent.language || "plain"}`, {
            "line-numbers": tabContent.showLineNumbers,
          })}
        >
          <code>{tabContent.code?.trim?.()}</code>
        </Pre>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        <Tabs>
          {code.map((c, index) =>
            c.title ? (
              <Tab
                key={index}
                className={classnames({ active: index === tab })}
                onClick={() => setTab(index)}
              >
                {c.title}
              </Tab>
            ) : null
          )}
        </Tabs>
      </Title>

      {tabContent.files.map((file, index) => (
        <Fragment key={index}>
          <FileTitle>
            <FileName>
              {file.language === "bash" ? <TerminalSvg /> : <FileSvg />}
              <span>{file.title || file.language}</span>
            </FileName>
            <CopyButton size="small" intent="ghost" text={file.code.trim()} />
          </FileTitle>
          <Pre
            key={`code--${tab}`}
            className={classnames(`language-${file.language || "plain"}`, {
              "line-numbers": file.showLineNumbers,
            })}
          >
            <code>{file.code.trim()}</code>
          </Pre>
        </Fragment>
      ))}
    </Container>
  );
}
