import { useEffect, useState } from "react";

/** Follow the palette BB has applied, including changes in another window. */
export function useHerdrTheme() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setId(root.getAttribute("data-herdr-theme"));
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-herdr-theme"] });
    sync();
    return () => observer.disconnect();
  }, []);
  return id;
}
