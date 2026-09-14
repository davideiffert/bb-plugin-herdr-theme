import type { PluginContentScriptContext } from "@get-bb/plugin-sdk/app";

/** BB updates its theme style element in head. Never inspect conversation text. */
export function mountChrome({ signal }: PluginContentScriptContext) {
  const root = document.documentElement;
  const sync = () => {
    const id = getComputedStyle(root).getPropertyValue("--herdr-theme-id").trim();
    if (id) root.setAttribute("data-herdr-theme", id);
    else root.removeAttribute("data-herdr-theme");
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.head, { childList: true, subtree: true, characterData: true });
  sync();
  const dispose = () => {
    observer.disconnect();
    root.removeAttribute("data-herdr-theme");
    signal.removeEventListener("abort", dispose);
  };
  signal.addEventListener("abort", dispose, { once: true });
  if (signal.aborted) dispose();
  return dispose;
}
