import { useHerdrTheme } from "./use-herdr-theme";
import { useRef } from "react";
import type { ExperimentalSidebarNavigationProps, ExperimentalSidebarNavigationItem } from "@get-bb/plugin-sdk/app";

export function Navigation(props: ExperimentalSidebarNavigationProps) {
  const enabled = useHerdrTheme();
  const menu = useRef<HTMLDetailsElement>(null);
  if (!enabled) return <props.experimental_Original />;
  const primary = props.items.filter(i => i.action.kind === "new-thread" || i.action.kind === "search-threads");
  const rest = props.items.filter(i => !primary.includes(i));
  const button = (item: ExperimentalSidebarNavigationItem) => <button key={item.id} type="button"
    disabled={item.isDisabled} aria-pressed={props.activeItemId === item.id}
    title={item.shortcut ? `${item.label} (${item.shortcut.label})` : item.label}
    aria-keyshortcuts={item.shortcut?.ariaKeyShortcuts}
    {...item.experimental_splitProps}
    onClick={event => {
      props.experimental_activate(item.id, { openInSplit: event.shiftKey });
      if (menu.current) menu.current.open = false;
    }}>{item.label}</button>;
  return <nav className="herdr-commands" aria-label="Workspace commands">
    {primary.map(button)}
    <details ref={menu} onKeyDown={event => {
      if (event.key === "Escape" && menu.current) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }}>
      <summary>Menu</summary>
      <div className="herdr-command-menu">{rest.map(button)}</div>
    </details>
  </nav>;
}
