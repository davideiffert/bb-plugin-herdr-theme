import { useHerdrTheme } from "./use-herdr-theme";
import { useState } from "react";
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
  const [editing, setEditing] = useState(false);
  if (!enabled) return <props.experimental_Original />;
  // BB's own destinations, plugin panels, and hidden items stay in their own
  // groups so nothing hides behind a dropdown. Empty groups render nothing.
  const workspace = nav.items.filter((i) => i.isVisible && i.pluginId === null);
  const plugins = nav.items.filter((i) => i.isVisible && i.pluginId !== null);
  const hidden = nav.items.filter((i) => !i.isVisible);
  const shared = {
    activeItemId: nav.activeItemId,
    shortcutHeld: nav.isShortcutModifierHeld,
    actions: nav.actions,
    editing,
  };
  return (
    <nav className="herdr-commands" aria-label="Workspace commands">
      <div className="herdr-command-groups">
        <CommandGroup title="workspace" items={workspace} {...shared} />
        <CommandGroup title="plugins" items={plugins} {...shared} />
        <CommandGroup title="hidden" items={hidden} {...shared} />
      </div>
      <div className="herdr-commands-footer">
        <button type="button" onClick={() => nav.actions.openCustomize()}>
          Customize…
        </button>
        <button
          type="button"
          aria-pressed={editing}
          title={editing ? "Hide row controls" : "Show Hide, Details, and Disable controls"}
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>
    </nav>
  );
}

function CommandGroup({
  title,
  items,
  activeItemId,
  shortcutHeld,
  actions,
  editing,
}: {
  title: string;
  items: readonly ExperimentalSidebarNavigationItem[];
  activeItemId: string | null;
  shortcutHeld: boolean;
  actions: ExperimentalSidebarNavigationActions;
  editing: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div className="herdr-command-group">
      <div className="herdr-command-group-title" aria-hidden="true">
        {title}
      </div>
      {items.map((item) => (
        <CommandRow
          key={item.id}
          item={item}
          activeItemId={activeItemId}
          shortcutHeld={shortcutHeld}
          actions={actions}
          editing={editing}
        />
      ))}
    </div>
  );
}

function CommandRow({
  item,
  activeItemId,
  shortcutHeld,
  actions,
  editing,
}: {
  item: ExperimentalSidebarNavigationItem;
  activeItemId: string | null;
  shortcutHeld: boolean;
  actions: ExperimentalSidebarNavigationActions;
  editing: boolean;
}) {
  const split = experimental_useSidebarNavigationSplit(item.id);
  const Accessory = item.experimental_Accessory;
  return (
    <div className="herdr-command-row">
      <button
        type="button"
        className="herdr-command-label"
        disabled={item.isDisabled || item.isLoading}
        aria-pressed={activeItemId === item.id}
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
      {Accessory && (
        <span className="herdr-command-accessory" aria-hidden="true">
          <Accessory />
        </span>
      )}
      {editing && (
        <>
          <button
            type="button"
            className="herdr-command-mini"
            title={
              item.isVisible
                ? `Hide ${item.label} from the sidebar`
                : `Show ${item.label} in the sidebar`
            }
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
                onClick={() => actions.openDetails(item.id)}
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
        </>
      )}
    </div>
  );
}
