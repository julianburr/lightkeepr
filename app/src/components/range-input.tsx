import { Ref, useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 3.6rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  user-select: none;
`;

const Track = styled.span`
  width: calc(100% - 0.4rem);
  height: 1.2rem;
  position: relative;
  cursor: pointer;

  &:before {
    content: " ";
    position: absolute;
    z-index: 1;
    height: 0.4rem;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    background: var(--sol--palette-sand-500);
    border-radius: 0.2rem;
  }
`;

const Marker = styled.span`
  display: flex;
  position: absolute;
  z-index: 100;
  top: 0;
  left: ${(props) =>
    ((props["aria-valuenow"]! - props["aria-valuemin"]!) /
      (props["aria-valuemax"]! - props["aria-valuemin"]!)) *
    100}%;
  height: 1.2rem;
  width: 1.2rem;

  input {
    position: absolute;
    pointer-events: none;
    opacity: 0;
  }

  &:before {
    content: " ";
    position: absolute;
    inset: 0;
    z-index: 100;
    border-radius: 50%;
    background: var(--sol--palette-sand-900);
    transition: transform 0.2s;
    transform: scale(1.2);
  }

  &:after {
    content: attr(data-valuenow);
    position: absolute;
    bottom: calc(100% + 0.8rem);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    padding: 0.8rem;
    background: #000;
    color: #fff;
    font-size: 1.2rem;
    line-height: 1.2;
    filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.25));
    border-radius: 0.3rem;
    z-index: 100;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s ease-in-out;
  }

  &.active,
  &:active,
  &:focus {
    &:before {
      transform: scale(1.5);
    }

    &:after {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
  }
`;

const Value = styled.span<{ value: number; min: number; max: number }>`
  position: absolute;
  z-index: 2;
  height: 0.4rem;
  top: 50%;
  left: 0;
  width: ${(props) =>
    ((props.value - props.min) / (props.max - props.min)) * 100}%;
  transform: translateY(-50%);
  background: var(--sol--palette-sand-900);
  border-radius: 0.2rem;
`;

type RangeInputProps = {
  name: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => any;
};

export function RangeInput({
  name,
  min = 0,
  max = 100,
  step = 1,
  value = min,
  onChange,
}: RangeInputProps) {
  const markerRef = useRef<HTMLSpanElement>();
  const trackRef = useRef<HTMLSpanElement>();
  const valueRef = useRef<HTMLSpanElement>();

  // Handle clicking and dragging marker and track elements
  useEffect(() => {
    let start = 0;
    let startOffset = 0;
    let dragging = false;

    if (!markerRef.current || !trackRef.current) {
      return;
    }

    function round(number: number, increment: number) {
      return Math.round(number / increment) * increment;
    }

    function roundClient(number: number) {
      const increment = (trackRef.current!.clientWidth / (max - min)) * step;
      return round(number, increment);
    }

    function getValue(pos: number) {
      return (
        round((pos / trackRef.current!.clientWidth) * (max - min), step) + min
      );
    }

    function handleDragStart(e: any) {
      e.preventDefault();
      e.stopPropagation();
      start = e.screenX || e.touches?.[0]?.screenX;
      startOffset = markerRef.current!.offsetLeft;
      dragging = true;
      markerRef.current!.classList.add("active");
    }

    function handleDrag(e: any) {
      if (dragging) {
        e.preventDefault();
        e.stopPropagation();
        const current = e.screenX || e.touches?.[0]?.screenX;
        const moved = current - start;
        const pos = Math.min(
          Math.max(roundClient(startOffset + moved), 0),
          trackRef.current!.clientWidth - markerRef.current!.clientWidth
        );
        onChange?.(getValue(pos));
      }
    }

    function handleDragEnd(e: any) {
      if (dragging) {
        e.preventDefault();
        e.stopPropagation();
        dragging = false;
        markerRef.current!.classList.remove("active");
      }
    }

    function handleTrackClick(e: any) {
      const current =
        e.offsetX ||
        e.touches?.[0]?.pageX -
          (trackRef.current?.getClientRects()?.[0]?.left || 0);
      const pos = Math.min(
        Math.max(roundClient(current), 0),
        trackRef.current!.clientWidth - markerRef.current!.clientWidth
      );
      onChange?.(getValue(pos));
      handleDragStart(e);
    }

    markerRef.current?.addEventListener?.("touchstart", handleDragStart);
    window.document.body?.addEventListener?.("touchmove", handleDrag);
    window.document.body?.addEventListener?.("touchend", handleDragEnd);
    markerRef.current?.addEventListener?.("mousedown", handleDragStart);
    window.document.body?.addEventListener?.("mousemove", handleDrag);
    window.document.body?.addEventListener?.("mouseup", handleDragEnd);

    trackRef.current?.addEventListener?.("mousedown", handleTrackClick);
    trackRef.current?.addEventListener?.("touchstart", handleTrackClick);

    return () => {
      markerRef.current?.removeEventListener?.("touchstart", handleDragStart);
      window.document.body?.removeEventListener?.("touchmove", handleDrag);
      window.document.body?.removeEventListener?.("touchend", handleDragEnd);
      markerRef.current?.removeEventListener?.("mousedown", handleDragStart);
      window.document.body?.removeEventListener?.("mousemove", handleDrag);
      window.document.body?.removeEventListener?.("mouseup", handleDragEnd);

      trackRef.current?.removeEventListener?.("mousedown", handleTrackClick);
      trackRef.current?.removeEventListener?.("touchstart", handleTrackClick);
    };
  }, [step, min, max]);

  // Handle keyboard events
  useEffect(() => {
    function handleKeyDown(e: any) {
      e.preventDefault();
      e.stopPropagation();
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          onChange?.(Math.max(value - step, min));
          break;
        case "ArrowRight":
        case "ArrowUp":
          onChange?.(Math.max(value + step, min));
          break;
        case "PageDown":
          onChange?.(Math.max(value - step * 10, min));
          break;
        case "PageUp":
          onChange?.(Math.max(value + step * 10, min));
          break;
        case "Home":
          onChange?.(min);
          break;
        case "End":
          onChange?.(max);
          break;
        default:
          return;
      }
    }

    markerRef.current?.addEventListener?.("keydown", handleKeyDown);
    return () =>
      markerRef.current?.removeEventListener?.("keydown", handleKeyDown);
  }, [step, min, max, value]);

  const safeValue = Math.min(Math.max(value, min), max);

  return (
    <Container>
      <Track ref={trackRef as Ref<HTMLSpanElement>}>
        <Marker
          ref={markerRef as Ref<HTMLSpanElement>}
          aria-orientation="horizontal"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={safeValue}
          data-valuenow={safeValue}
          role="slider"
          tabIndex={0}
        >
          <input
            type="range"
            name={name}
            min={min}
            max={max}
            step={step}
            tabIndex={-1}
          />
        </Marker>
        <Value
          ref={valueRef as Ref<HTMLSpanElement>}
          value={safeValue}
          min={min}
          max={max}
        />
      </Track>
    </Container>
  );
}
