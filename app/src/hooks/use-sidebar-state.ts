import { useEffect, useRef, useState } from "react";

export function useSidebarState() {
  const menuRef = useRef<HTMLMenuElement>();
  const backdropRef = useRef<HTMLDivElement>();

  // Active state and toggling behaviour based on events
  const [active, setActive] = useState(false);
  useEffect(() => {
    function handleToggle() {
      setActive((state) => !state);
    }

    function handleBackdropClick(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActive(false);
      }
    }

    const body = window.document.body;
    const backdrop = backdropRef.current;

    body.addEventListener("toggleMobileMenu", handleToggle);
    backdrop?.addEventListener?.("click", handleBackdropClick);
    return () => {
      body.removeEventListener("toggleMobileMenu", handleToggle);
      backdrop?.removeEventListener?.("click", handleBackdropClick);
    };
  }, []);

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
