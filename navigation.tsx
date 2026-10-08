import { useHerdrTheme } from "./use-herdr-theme";
import { useRef } from "react";
import {
  experimental_useSidebarNavigation,
  experimental_useSidebarNavigationSplit,
} from "@get-bb/plugin-sdk/app";
import type {
  ExperimentalSidebarNavigationActions,
  ExperimentalSidebarNavigationItem,
  ExperimentalSidebarNavigationProps,
} from "@get-bb/plugin-sdk/app";

export function Navigation(props: ExperimentalSidebarNavigationProps) {
  const enabled = useHerdrTheme();
  // Hooks stay unconditional so early return below never reorders them.
  const nav = experimental_useSidebarNavigation();
  const menu = useRef<HTMLDetailsElement>(null);
  if (!enabled) return <props.experimental_Original />;
  const closeMenu = () => {
    if (menu.current) menu.current.open = false;
  };
  // Hidden items stay reachable in the overflow menu, per SDK guidance.
  const primary = nav.items.filter(
    (i) => i.isVisible && (i.action.kind === "new-thread" || i.action.kind === "search-threads"),
  );
  const rest = nav.items.filter((i) => !primary.includes(i));
  return (
    <nav className="herdr-commands" aria-label="Workspace commands">
      {primary.map((item) => (
        <NavButton
          key={item.id}
          item={item}
          activeItemId={nav.activeItemId}
          actions={nav.actions}
          onNavigate={closeMenu}
        />
      ))}
      <details
        ref={menu}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current) {
            menu.current.open = false;
            menu.current.querySelector("summary")?.focus();
          }
        }}
      >
        <summary>Menu</summary>
        <div className="herdr-command-menu">
          {rest.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              activeItemId={nav.activeItemId}
              actions={nav.actions}
              onNavigate={closeMenu}
              inMenu
            />
          ))}
        </div>
      </details>
    </nav>
  );
}

function NavButton({
  item,
  activeItemId,
  actions,
  onNavigate,
  inMenu = false,
}: {
  item: ExperimentalSidebarNavigationItem;
  activeItemId: string | null;
  actions: ExperimentalSidebarNavigationActions;
  onNavigate: () => void;
  inMenu?: boolean;
}) {
  // Per-item hook, so one component instance per row. Menu rows use
  // distance activation so the list's own pointer handling keeps working.
  const split = experimental_useSidebarNavigationSplit(
    item.id,
    inMenu ? { activation: "distance", onDragStart: onNavigate } : undefined,
  );
  return (
    <button
      key={item.id}
      type="button"
      disabled={item.isDisabled || item.isLoading}
      aria-pressed={activeItemId === item.id}
      title={item.shortcut ? `${item.label} (${item.shortcut.label})` : item.label}
      aria-keyshortcuts={item.shortcut?.ariaKeyShortcuts}
      {...split.splitProps}
      onClick={(event) => {
        actions.activate(item.id, { openInSplit: event.shiftKey });
        onNavigate();
      }}
    >
      {item.label}
    </button>
  );
}
