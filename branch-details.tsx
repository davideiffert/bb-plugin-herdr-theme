import { useEffect } from "react";
import { experimental_useSidebarThreads, useSettings } from "@get-bb/plugin-sdk/app";
import { useHerdrTheme } from "./use-herdr-theme";

/** Decorate only stock sidebar titles; BB still owns rows and their actions. */
export function BranchDetails() {
  const theme = useHerdrTheme();
  const { values } = useSettings();
  return theme && values?.showBranches === true ? <ActiveBranchDetails /> : null;
}

function ActiveBranchDetails() {
  const { threads } = experimental_useSidebarThreads();
  const branches = JSON.stringify(threads.filter(t => t.environment?.branchName)
    .map(t => [t.id, t.environment!.branchName]).sort((a, b) => a[0]!.localeCompare(b[0]!)));
  useEffect(() => {
    const names = new Map<string, string>(JSON.parse(branches));
    const owned = new Set<HTMLElement>();
    const sync = () => {
      document.querySelectorAll<HTMLElement>("[data-sidebar-project-id] [data-sidebar-thread-id]").forEach(link => {
        const row = link.closest(".group\\/thread-row");
        const title = row?.querySelector<HTMLElement>(".bb-thread-title, .bb-sidebar-thread-title");
        if (!title) return;
        const branch = names.get(link.dataset.sidebarThreadId!);
        if (branch) {
          if (title.dataset.herdrBranch !== branch) title.dataset.herdrBranch = branch;
          owned.add(title);
        } else {
          title.removeAttribute("data-herdr-branch");
          owned.delete(title);
        }
      });
      for (const title of owned) if (!title.isConnected) owned.delete(title);
    };
    // Observe row mounting/unmounting, not attributes we set ourselves.
    const observer = new MutationObserver(records => {
      if (records.some(r => r.target instanceof Element &&
        (r.target.closest('[data-sidebar="sidebar"]') ||
          Array.from(r.addedNodes).some(n => n instanceof Element &&
            (n.matches('[data-sidebar="sidebar"]') || n.querySelector('[data-sidebar="sidebar"]')))))) sync();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    sync();
    return () => {
      observer.disconnect();
      for (const title of owned) title.removeAttribute("data-herdr-branch");
    };
  }, [branches]);
  return null;
}
