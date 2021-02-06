import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { usePopper } from "react-popper";
import { Placement } from "@popperjs/core";

const Menu = styled.menu`
  background: #fff;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.2);
  border-radius: 0.2rem;
  width: 14rem;
  padding: 0.6rem 0;
  margin: 0.6rem;

  & ul {
    margin: 0;
    padding: 0;
  }

  & li {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;

    & a,
    & button {
      border: 0 none;
      background: none;
      width: 100%;
      cursor: pointer;
      text-decoration: none;
      padding: 0.6rem 1.2rem;
      color: inherit;
      display: flex;
      transition: background 0.2s;

      &:hover {
        background: #f4f4f4;
      }
    }
  }
`;

const Button = styled.button`
  cursor: pointer;
  border: 0 none;
  background: none;
  padding: 0;
`;

type ActionMenuProps = {
  items?: { label: string; onClick?: (e: any) => void; path?: string }[];
  children: ReactNode;
  placement?: Placement;
};

export function ActionMenu({
  items = [],
  children,
  placement,
}: ActionMenuProps) {
  const [elementRef, setElementRef] = useState(null);
  const [popperRef, setPopperRef] = useState(null);

  const [open, setOpen] = useState(false);

  const { styles, attributes } = usePopper(elementRef, popperRef, {
    placement,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsideClick(e) {
      console.log({ e });
      if (!popperRef?.contains(e.target)) {
        setOpen(false);
      }
    }

    console.log("register");
    window.document.addEventListener("click", handleOutsideClick, true);
    return () =>
      window.document.removeEventListener("click", handleOutsideClick, true);
  }, [open, popperRef]);

  return (
    <>
      <Button ref={setElementRef} onClick={() => setOpen((state) => !state)}>
        {children}
      </Button>
      {open && (
        <Menu ref={setPopperRef} style={styles.popper} {...attributes.popper}>
          <ul>
            {items?.map((item, index) => (
              <li key={index}>
                {item.path ? (
                  <Link
                    to={item.path}
                    onClick={(e) => {
                      item?.onClick?.(e);
                      if (!e.defaultPrevented) {
                        setOpen(false);
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={(e) => {
                      item?.onClick?.(e);
                      if (!e.defaultPrevented) {
                        e.preventDefault();
                        setOpen(false);
                      }
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Menu>
      )}
    </>
  );
}
