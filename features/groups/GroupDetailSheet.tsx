"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type GroupDetailSheetSnap = "mid" | "full";

interface GroupDetailSheetProps {
  children: ReactNode;
  /** Tabs + handle live in the sticky header so drag always works. */
  header: ReactNode;
  snap: GroupDetailSheetSnap;
  onSnapChange: (snap: GroupDetailSheetSnap) => void;
}

const SNAP_VELOCITY = 0.45;
const SNAP_DISTANCE_RATIO = 0.28;

/**
 * Figma group-detail bottom sheet — mid (hero visible) ↔ full (almost fullscreen).
 * Drag the handle / tab strip to snap; content scrolls inside the sheet.
 */
export function GroupDetailSheet({
  children,
  header,
  snap,
  onSnapChange,
}: GroupDetailSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [viewportH, setViewportH] = useState(0);
  const [dragTop, setDragTop] = useState<number | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    startTop: number;
    lastY: number;
    lastT: number;
    velocity: number;
    moved: boolean;
  } | null>(null);
  const didDragRef = useRef(false);

  const measure = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    setViewportH(el.clientHeight);
  }, []);

  useEffect(() => {
    measure();
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const snapTops = useCallback(() => {
    const h = viewportH || (typeof window !== "undefined" ? window.innerHeight : 700);
    const safeTop =
      typeof window !== "undefined"
        ? Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--safe-top"
            )
          ) || 0
        : 0;
    /** Peek of hero chrome (back + menu) — matches Figma full modal. */
    const fullTop = Math.max(safeTop, 47) + 56;
    /** Default: leave room for hero avatars + title (Figma “Added” frame). */
    const midTop = Math.min(
      Math.max(h * 0.42, 280),
      h - 220
    );
    return { fullTop, midTop: Math.max(midTop, fullTop + 80) };
  }, [viewportH]);

  const settledTop = (() => {
    const { fullTop, midTop } = snapTops();
    return snap === "full" ? fullTop : midTop;
  })();

  const sheetTop = dragTop ?? settledTop;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    // Tabs stay clickable; the grab-handle button still starts a drag.
    if ((event.target as HTMLElement).closest("[role='tab'], a")) return;
    const isHandle = Boolean(
      (event.target as HTMLElement).closest("[data-sheet-handle]")
    );
    if (
      !isHandle &&
      (event.target as HTMLElement).closest("button, [role='tab']")
    ) {
      return;
    }

    const { fullTop, midTop } = snapTops();
    const startTop = snap === "full" ? fullTop : midTop;
    didDragRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startTop,
      lastY: event.clientY,
      lastT: performance.now(),
      velocity: 0,
      moved: false,
    };
    setDragTop(startTop);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const { fullTop, midTop } = snapTops();
    const delta = event.clientY - drag.startY;
    if (Math.abs(delta) > 6) {
      drag.moved = true;
      didDragRef.current = true;
    }
    const next = Math.min(midTop, Math.max(fullTop, drag.startTop + delta));
    const now = performance.now();
    const dt = Math.max(now - drag.lastT, 1);
    drag.velocity = (event.clientY - drag.lastY) / dt;
    drag.lastY = event.clientY;
    drag.lastT = now;
    setDragTop(next);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const { fullTop, midTop } = snapTops();
    const current = dragTop ?? drag.startTop;
    const travel = current - drag.startTop;
    const span = midTop - fullTop;
    let next: GroupDetailSheetSnap = snap;

    if (drag.moved) {
      if (drag.velocity < -SNAP_VELOCITY) next = "full";
      else if (drag.velocity > SNAP_VELOCITY) next = "mid";
      else if (snap === "mid" && travel < -span * SNAP_DISTANCE_RATIO)
        next = "full";
      else if (snap === "full" && travel > span * SNAP_DISTANCE_RATIO)
        next = "mid";
      else {
        const midPoint = (fullTop + midTop) / 2;
        next = current < midPoint ? "full" : "mid";
      }
    }

    dragRef.current = null;
    setDragTop(null);
    if (drag.moved && next !== snap) onSnapChange(next);
  };

  return (
    <div ref={rootRef} className="relative min-h-0 flex-1 overflow-hidden">
      <div
        role="dialog"
        aria-label="Group details"
        aria-modal={false}
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 flex flex-col bg-white",
          "rounded-t-[24px] shadow-[0_-4px_24px_rgba(21,19,26,0.06)]",
          dragTop === null && "transition-[top] duration-300 ease-out"
        )}
        style={{ top: sheetTop }}
      >
        <div
          className="touch-none shrink-0 cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <button
            type="button"
            data-sheet-handle
            className="flex w-full justify-center pb-1 pt-3"
            aria-label={
              snap === "full" ? "Collapse group panel" : "Expand group panel"
            }
            onClick={() => {
              if (didDragRef.current) {
                didDragRef.current = false;
                return;
              }
              onSnapChange(snap === "full" ? "mid" : "full");
            }}
          >
            <span className="h-1 w-10 rounded-full bg-[#D1D1D6]" aria-hidden />
          </button>
          {header}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
