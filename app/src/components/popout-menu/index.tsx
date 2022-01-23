import { Fragment } from "react";
import { useCallback } from "react";
import {
  Ref,
  useEffect,
  Dispatch,
  SetStateAction,
  ComponentType,
  useRef,
  ReactNode,
} from "react";
import styled from "styled-components";

import { HeadingItem } from "./heading-item";
import { MenuItem, MenuItemObj } from "./menu-item";

const Ul = styled.ul`
  margin: 0;
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  line-height: 1.2;
  word-wrap: break-word;

  ul {
    padding: 0;
  }

  hr {
    border: 0 none;
    height: 0.1rem;
    background: rgba(0, 0, 0, 0.05);
    width: calc(100% - 0.8rem);
    margin: 0.5rem auto;
  }

  p {
    margin: 0;
  }
`;

const Li = styled.li`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Container = styled.div`
  padding: 1.2rem;
`;

type CustomItemObj = {
  key?: string;
  isCustom: true;
  Content: ComponentType<any>;
};

type Item = MenuItemObj | CustomItemObj;

type ItemGroup = {
  key?: string;
  label?: ReactNode;
  icon?: ReactNode;
  items: Item[] | ItemGroup[];
};

export type Items = Item[] | ItemGroup[];

type PopoutMenuProps = {
  items: Items;
  setVisible: Dispatch<SetStateAction<boolean>>;
  element?: HTMLElement;
};

export function PopoutMenu({ items, setVisible, element }: PopoutMenuProps) {
  const ulRef = useRef<HTMLUListElement>();

  useEffect(() => {
    const el = ulRef.current;
    if (!el) {
      return;
    }

    function handleKeyDown(e: any) {
      const focusable = el?.querySelectorAll("[data-focusable]");
      if (!focusable?.length) {
        return;
      }

      const focusIndex =
        focusable && window.document.activeElement
          ? Array.from(focusable).indexOf?.(window.document.activeElement)
          : -1;

      switch (e.key) {
        case "ArrowDown":
          if (focusIndex === -1 || focusIndex >= focusable?.length - 1) {
            (focusable[0] as HTMLElement).focus();
          } else {
            (focusable[focusIndex + 1] as HTMLElement).focus();
          }
          break;
        case "ArrowUp":
          if (focusIndex <= 0) {
            (focusable[focusable.length - 1] as HTMLElement).focus();
          } else {
            (focusable[focusIndex - 1] as HTMLElement).focus();
          }
          break;
      }
    }

    window.document.addEventListener("keydown", handleKeyDown);
    return () => window.document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderItems = useCallback((items: Items): ReactNode => {
    return items.map((item, index) => {
      if ("items" in item) {
        return (
          <Fragment key={item.key || index}>
            {index > 0 && (
              <Li>
                <hr />
              </Li>
            )}
            <Li>
              <ul>
                {item.label && (
                  <Li>
                    <HeadingItem item={item} />
                  </Li>
                )}
                {renderItems(item.items)}
              </ul>
            </Li>
          </Fragment>
        );
      }

      if ("isCustom" in item) {
        return (
          <Li key={item.key || index}>
            <Container>
              <item.Content item={item} setVisible={setVisible} />
            </Container>
          </Li>
        );
      }

      return (
        <Li key={item.key || index}>
          <MenuItem item={item} setVisible={setVisible} element={element} />
        </Li>
      );
    });
  }, []);

  return <Ul ref={ulRef as Ref<HTMLUListElement>}>{renderItems(items)}</Ul>;
}
