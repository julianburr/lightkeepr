import { useEffect, useRef, useState } from "react";

export function useSidebarState(id?: string) {
  const menuRef = useRef<HTMLMenuElement>();
  const backdropRef = useRef<HTMLDivElement>();

  const eventName = id ? `toggleMobileMenu:${id}` : "toggleMobileMenu";

  // Active state and toggling behaviour based on events
  const [active, setActive] = useState(false);
  useEffect(() => {
    function handleToggle() {
      setActive((state) => !state);
    }

    function handleBackdropClick(e: any) {
      if (backdropRef.current && backdropRef.current === e.target) {
        setActive(false);
      }
    }

    function handleKeyDown(e: any) {
      if (e.key === "Escape") {
        setActive(false);
      }
    }

    const body = window.document.body;
    const backdrop = backdropRef.current;

    body.addEventListener(eventName, handleToggle);
    body.addEventListener("keydown", handleKeyDown);
    backdrop?.addEventListener?.("click", handleBackdropClick);
    return () => {
      body.removeEventListener(eventName, handleToggle);
      body.removeEventListener("keydown", handleKeyDown);
      backdrop?.removeEventListener?.("click", handleBackdropClick);
    };
  }, []);

  useEffect(() => {
    const className = id ? `noscroll-${id}` : `noscroll`;
    if (active) {
      window.document.body?.classList?.add?.(className);
    } else {
      window.document.body?.classList?.remove?.(className);
    }
  }, [active]);

  // Handle swipe actions to close the menu
  useEffect(() => {
    if (!active || !menuRef.current) {
      return;
    }

    let touchstartX = 0;
    function handleTouchStart(e: any) {
      touchstartX = e.changedTouches[0].screenX;
    }

    function handleTouchMove(e: any) {
      const moved = e.changedTouches[0].screenX - touchstartX;
      if (moved > 15) {
        e.preventDefault();
        e.stopPropagation();
        if (menuRef.current) {
          menuRef.current.style.transform = `translateX(calc(${moved}px)`;
        }
      }
    }

    function handleTouchEnd(e: any) {
      const moved = e.changedTouches[0].screenX - touchstartX;
      if (menuRef.current) {
        menuRef.current.style.transform = "";
        if (moved > 80) {
          setActive(false);
        }
      }
    }

    const el = menuRef.current;
    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchmove", handleTouchMove);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [active]);

  return { active, setActive, backdropRef, menuRef };
}
