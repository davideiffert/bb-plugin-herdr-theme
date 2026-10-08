import { useHerdrTheme } from "./use-herdr-theme";
import { useRef } from "react";
import {
  experimental_SidebarNavigationIcon as SidebarNavigationIcon,
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
  // Hooks stay unconditional so the early return below never reorders them.
  const nav = experimental_useSidebarNavigation();
  if (!enabled) return <props.experimental_Original />;
  // Hidden items stay reachable in the overflow menu, per SDK guidance.
  const primary = nav.items.filter(
    (i) => i.isVisible && (i.action.kind === "new-thread" || i.action.kind === "search-threads"),
  );
  const rest = nav.items.filter((i) => !primary.includes(i));
  return (
    <nav className="herdr-commands" aria-label="Workspace commands">
      {!props.isCompactViewport &&
        primary.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            activeItemId={nav.activeItemId}
            shortcutHeld={nav.isShortcutModifierHeld}
            actions={nav.actions}
          />
        ))}
      <CommandMenu
        items={props.isCompactViewport ? nav.items : rest}
        activeItemId={nav.activeItemId}
        shortcutHeld={nav.isShortcutModifierHeld}
        actions={nav.actions}
      />
    </nav>
  );
}

function NavButton({
  item,
  activeItemId,
  shortcutHeld,
  actions,
}: {
  item: ExperimentalSidebarNavigationItem;
  activeItemId: string | null;
  shortcutHeld: boolean;
  actions: ExperimentalSidebarNavigationActions;
}) {
  const split = experimental_useSidebarNavigationSplit(item.id);
  return (
    <button
      type="button"
      disabled={item.isDisabled || item.isLoading}
      aria-pressed={activeItemId === item.id}
      title={item.shortcut ? `${item.label} (${item.shortcut.label})` : item.label}
      aria-keyshortcuts={item.shortcut?.ariaKeyShortcuts}
      {...split.splitProps}
      onClick={(event) => {
        actions.activate(item.id, { openInSplit: event.shiftKey });
      }}
    >
      <SidebarNavigationIcon icon={item.icon} className="herdr-command-icon" />
      <span>{item.label}</span>
      {shortcutHeld && item.shortcut && <kbd>{item.shortcut.label}</kbd>}
    </button>
  );
}

function CommandMenu({
  items,
  activeItemId,
  shortcutHeld,
  actions,
}: {
  items: readonly ExperimentalSidebarNavigationItem[];
  activeItemId: string | null;
  shortcutHeld: boolean;
  actions: ExperimentalSidebarNavigationActions;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => {
    if (menu.current) menu.current.open = false;
  };
  return (
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
        {items.map((item) => (
          <MenuRow
            key={item.id}
            item={item}
            activeItemId={activeItemId}
            shortcutHeld={shortcutHeld}
            actions={actions}
            onNavigate={closeMenu}
          />
        ))}
        <div className="herdr-command-menu-footer">
          <button
            type="button"
            onClick={() => {
              actions.openCustomize();
              closeMenu();
            }}
          >
            Customize…
          </button>
        </div>
      </div>
    </details>
  );
}

function MenuRow({
  item,
  activeItemId,
  shortcutHeld,
  actions,
  onNavigate,
}: {
  item: ExperimentalSidebarNavigationItem;
  activeItemId: string | null;
  shortcutHeld: boolean;
  actions: ExperimentalSidebarNavigationActions;
  onNavigate: () => void;
}) {
  // Distance activation so the menu's own pointer handling keeps working.
  const split = experimental_useSidebarNavigationSplit(item.id, {
    activation: "distance",
    onDragStart: onNavigate,
  });
  const Accessory = item.experimental_Accessory;
  return (
    <div className="herdr-command-row">
      <button
        type="button"
        className="herdr-command-label"
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
        <SidebarNavigationIcon icon={item.icon} className="herdr-command-icon" />
        <span>{item.label}</span>
        {shortcutHeld && item.shortcut && <kbd>{item.shortcut.label}</kbd>}
      </button>
      {Accessory && (
        <span className="herdr-command-accessory" aria-hidden="true">
          <Accessory />
        </span>
      )}
      <button
        type="button"
        className="herdr-command-mini"
        title={item.isVisible ? `Hide ${item.label} from the sidebar` : `Show ${item.label} in the sidebar`}
        onClick={() => actions.setVisible(item.id, !item.isVisible)}
      >
        {item.isVisible ? "Hide" : "Show"}
      </button>
      {item.pluginId && (
        <>
          <button
            type="button"
            className="herdr-command-mini"
            title={`About ${item.label}`}
            onClick={() => {
              actions.openDetails(item.id);
              onNavigate();
            }}
          >
            Details
          </button>
          <button
            type="button"
            className="herdr-command-mini"
            title={`Disable ${item.label}`}
            // The host toasts failures; swallow here to avoid an unhandled rejection.
            onClick={() => void actions.disablePlugin(item.id).catch(() => {})}
          >
            Disable
          </button>
        </>
      )}
    </div>
  );
}
