import { createFocusTrap } from "focus-trap";
import hotkeys from "hotkeys-js";
import { useRouter } from "next/router";
import { Ref, useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import styled from "styled-components";

import { TextInput } from "src/components/text-input";
import { SearchResultListItem } from "src/list-items/search-result";

import SearchSvg from "src/assets/icons/outline/search.svg";

import { List } from "./list";

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 400;
  backdrop-filter: blur(0.2rem);
  padding: 2.4rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.1s;

  @media (min-width: 800px) {
    padding: 4.2rem;
  }

  &[data-active="true"] {
    opacity: 1;
    pointer-events: all;
  }
`;

const Inner = styled.div`
  padding: var(--sol--spacing-m);
  width: 100%;
  max-width: 50rem;
  margin: 8rem auto 4rem;
`;

const WrapInput = styled.div`
  position: relative;
  font-size: 2rem;

  svg {
    position: absolute;
    top: 50%;
    left: 1.6rem;
    height: 1.2em;
    width: auto;
    transform: translateY(-50%);
  }

  input {
    width: 100%;
    height: auto;
    padding: 1.2rem 1.2rem 1.2rem 6rem;
    border: 0 none;
  }
`;

const WrapResults = styled.div`
  padding: 1.6rem 0 0;

  ul {
    gap: 0.1rem;
  }

  li > a {
    background: var(--sol--color-white);
    border-radius: 0;

    &:hover {
      background: var(--sol--palette-sand-50);
    }
  }

  li:first-child > a {
    border-radius: 0.3rem 0.3rem 0 0;
  }

  li:last-child > a {
    border-radius: 0 0 0.3rem 0.3rem;
  }
`;

export function toggleGlobalSearch() {
  const event = new CustomEvent("toggleGlobalSearch");
  window.document.body.dispatchEvent(event);
}

type GlobalSearchProps = {
  onSearch?: (val: string) => any;
  results?: any[];
};

export function GlobalSearch({ onSearch, results }: GlobalSearchProps) {
  const router = useRouter();

  const debounce = useRef<any>();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      onSearch?.(value);
    }, 800);
  }, [value]);

  useEffect(() => {
    if (!show) {
      setValue("");
    }
  }, [show]);

  // Search hotkey and global event listener
  useEffect(() => {
    function toggleShow() {
      setShow((state) => !state);
    }

    // NOTE: this is needed to allow the hotkey to trigger from within
    // text fields etc
    hotkeys.filter = () => true;

    hotkeys("cmd + k", toggleShow);
    window.document.body.addEventListener("toggleGlobalSearch", toggleShow);
    return () => {
      hotkeys.unbind("cmd + k", toggleShow);
      window.document.body.removeEventListener(
        "toggleGlobalSearch",
        toggleShow
      );
    };
  }, []);

  // Create focus trap
  const containerRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (containerRef.current && show) {
      containerRef.current.querySelector("input")?.focus?.();

      const trap = createFocusTrap(containerRef.current);
      trap.activate();
      return () => {
        trap.deactivate();
      };
    }
  }, [show]);

  // Close search when clicking on the backdrop
  useEffect(() => {
    const backdrop = containerRef.current;

    function handleClick(e: any) {
      if (e.target === backdrop) {
        setShow(false);
      }
    }

    backdrop?.addEventListener("click", handleClick);
    return () => backdrop?.removeEventListener?.("click", handleClick);
  }, []);

  // Close search on `esc` and on click on the backdrop
  useEffect(() => {
    function handleEscape(e: any) {
      if (e.key === "Escape") {
        setShow(false);
      }
    }
    window.document.body.addEventListener("keydown", handleEscape);
    return () =>
      window.document.body.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <Container ref={containerRef as Ref<HTMLDivElement>} data-active={show}>
      <Inner>
        <WrapInput>
          <SearchSvg />
          <TextInput
            placeholder="Type to search..."
            value={value}
            onChange={setValue}
          />
        </WrapInput>

        <WrapResults>
          <List
            items={results || []}
            Item={SearchResultListItem}
            emptyView={null}
          />
        </WrapResults>
      </Inner>
    </Container>
  );
}
