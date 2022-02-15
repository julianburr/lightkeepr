import "src/utils/firebase";

import Editor from "@draft-js-plugins/editor";
import createLinkifyPlugin from "@draft-js-plugins/linkify";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import {
  collection,
  documentId,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { useCollection } from "src/@packages/firebase";
import { Mention } from "src/components/mention";
import { useAuthUser } from "src/hooks/use-auth-user";

const db = getFirestore();

const Container = styled.div`
  border: 0.1rem solid;
  border-color: var(--sol--input-border-color-default);
  border-radius: var(--sol--input-border-radius);
  min-height: 3.6rem;
  max-height: 15rem;
  padding: 0.6rem 0.8rem;
  line-height: 1.4;

  .DraftEditor-root {
    position: relative;
  }

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    inset: 0;
    pointer-events: none;
    color: var(--sol--palette-grey-200);
  }

  .public-DraftEditorPlaceholder-inner {
    white-space: nowrap !important;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .mentionSuggestions {
    background: var(--sol--color-white);
    filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.25));
    border-radius: 0.3rem;
    padding: 0.4rem;
    min-width: 14rem;
  }

  [role="option"] {
    padding: 0.4rem;
    border-radius: 0.3rem;
    cursor: pointer;
    width: 100%;

    &.mentionSuggestionsEntryFocused,
    &:hover {
      background: var(--sol--palette-sand-50);
    }
  }
`;

type RichTextInputProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void | Promise<void>;
  onEnter?: (value: string) => void | Promise<void>;
};

export function RichTextInput({
  value = "",
  placeholder,
  onChange,
  onEnter,
}: RichTextInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor>(null);

  const authUser = useAuthUser();
  const users = useCollection(
    query(
      collection(db, "users"),
      where(documentId(), "in", authUser.team?.users || [])
    ),
    { key: `${authUser?.team?.id}/users` }
  );

  const convertToMarkdownMap = {
    entityItems: {
      mention: {
        open: function () {
          return `[`;
        },
        close: function (entity: any) {
          return `](#mention_${entity.data.mention?.id})`;
        },
      },
    },
  };

  const convertToRawMap = {
    blockEntities: {
      link_open: (item: any) => {
        const match = item.href?.match?.(/^#mention_(.+)/);
        const user = match?.[1]
          ? users.find((user: any) => user.id === match[1])
          : undefined;
        if (user) {
          return {
            type: "mention",
            mutability: "IMMUTABLE",
            data: { mention: user },
          };
        }
        return item;
      },
    },
  };

  const initialState = useMemo(() => {
    const raw = markdownToDraft(value, convertToRawMap);
    return EditorState.createWithContent(convertFromRaw(raw));
  }, []);
  const [editorState, setEditorState] = useState(initialState);

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const linkifyPlugin = createLinkifyPlugin({ target: "_blank" });
    const mentionPlugin = createMentionPlugin({
      mentionComponent: Mention as any,
      theme: {
        mentionSuggestions: "mentionSuggestions",
        mentionSuggestionsEntry: "mentionSuggestionsEntry",
        mentionSuggestionsEntryFocused: "mentionSuggestionsEntryFocused",
      },
    });
    return {
      plugins: [linkifyPlugin, mentionPlugin],
      MentionSuggestions: mentionPlugin.MentionSuggestions,
    };
  }, []);

  const handleChange = useCallback(
    (state: EditorState) => {
      setEditorState(state);
      if (onChange) {
        const raw = convertToRaw(state.getCurrentContent());
        const content = draftToMarkdown(raw, convertToMarkdownMap);
        onChange(content);
      }
    },
    [onChange]
  );

  const handleSearch = useCallback(({ value }: { value: string }) => {
    setSuggestions(defaultSuggestionsFilter(value, users));
  }, []);

  useEffect(() => {
    function handleKeyDown(e: any) {
      if (!open && onEnter && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        const raw = convertToRaw(editorState.getCurrentContent());
        const content = draftToMarkdown(raw, convertToMarkdownMap);
        onEnter(content);
      }
    }

    if (containerRef.current) {
      const node = containerRef.current;
      node.addEventListener("keydown", handleKeyDown);
      return () => node.removeEventListener("keydown", handleKeyDown);
    }
  }, [editorState, open]);

  return (
    <Container ref={containerRef}>
      <Editor
        editorKey="editor"
        editorState={editorState}
        onChange={handleChange}
        plugins={plugins}
        placeholder={placeholder}
        ref={editorRef as any}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={setOpen}
        suggestions={suggestions}
        onSearchChange={handleSearch}
      />
    </Container>
  );
}
