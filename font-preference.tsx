import { useEffect } from "react";
import { useSettings } from "@get-bb/plugin-sdk/app";
import { useHerdrTheme } from "./use-herdr-theme";

/** Opt out of the terminal look for prose: system sans for UI, mono kept for code. */
export function FontPreference() {
  const theme = useHerdrTheme();
  const { values } = useSettings();
  const sans = theme != null && values?.monoUI === false;
  useEffect(() => {
    const root = document.documentElement;
    if (sans) root.setAttribute("data-herdr-sans", "");
    else root.removeAttribute("data-herdr-sans");
    return () => {
      root.removeAttribute("data-herdr-sans");
    };
  }, [sans]);
  return null;
}
