import { useHerdrTheme } from "./use-herdr-theme";
import { useRef, type RefObject } from "react";
import {
  experimental_useSidebarNavigation,
  experimental_useSidebarNavigationSplit,
  type ExperimentalSidebarNavigationProps,
  type ExperimentalSidebarNavigationItem,
  type ExperimentalSidebarNavigationState,
} from "@get-bb/plugin-sdk/app";

export function Navigation(props: ExperimentalSidebarNavigationProps) {
  const enabled = useHerdrTheme();
  if (!enabled) return <props.experimental_Original />;
  return <Commands />;
}

function Commands() {
  const nav = experimental_useSidebarNavigation();
  const menu = useRef<HTMLDetailsElement>(null);
  const isPrimary = (i: ExperimentalSidebarNavigationItem) =>
    i.isVisible && (i.action.kind === "new-thread" || i.action.kind === "search-threads");
  const primary = nav.items.filter(isPrimary);
  const rest = nav.items.filter(i => !isPrimary(i));
  return <nav className="herdr-commands" aria-label="Workspace commands">
    {primary.map(item => <Command key={item.id} item={item} nav={nav} menu={menu} />)}
    <details ref={menu} onKeyDown={event => {
      if (event.key === "Escape" && menu.current) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }}>
      <summary>Menu</summary>
      <div className="herdr-command-menu">
        {rest.map(item => <Command key={item.id} item={item} nav={nav} menu={menu} />)}
      </div>
    </details>
  </nav>;
}

function Command({ item, nav, menu }: {
  item: ExperimentalSidebarNavigationItem;
  nav: ExperimentalSidebarNavigationState;
  menu: RefObject<HTMLDetailsElement | null>;
}) {
  const close = () => { if (menu.current) menu.current.open = false; };
  const split = experimental_useSidebarNavigationSplit(item.id, { activation: "distance", onDragStart: close });
  const label = item.badge?.label ? `${item.label}, ${item.badge.label}` : item.label;
  return <button type="button"
    disabled={item.isDisabled || item.isLoading} aria-pressed={nav.activeItemId === item.id}
    aria-label={label}
    title={item.shortcut ? `${item.label} (${item.shortcut.label})` : item.label}
    aria-keyshortcuts={item.shortcut?.ariaKeyShortcuts}
    {...split.splitProps}
    onClick={event => {
      nav.actions.activate(item.id, { target: event.shiftKey ? "split" : "current" });
      close();
    }}>{item.label}</button>;
}
