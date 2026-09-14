import { useHerdrTheme } from "./use-herdr-theme";
import { useState } from "react";
import { useRpc } from "@get-bb/plugin-sdk/app";
import type { contract } from "./contract";
import catalog from "./palettes/catalog.json";

export function PalettePicker() {
  const rpc = useRpc<typeof contract>();
  const selected = useHerdrTheme();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function select(id: string) {
    setBusy(true); setError("");
    try { await rpc.call("select", `plugin:herdr-theme:${id}`); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not apply palette."); }
    finally { setBusy(false); }
  }
  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Choose a palette for BB. This updates the same selection as Settings → Appearance → Palette. BB's Light, Dark, or System setting controls the appearance.</p>
    {!selected && <p className="text-sm">Another BB theme is selected. Choose a palette below to enable Herdr Theme.</p>}
    <div className="herdr-palette-grid" role="group" aria-label="Herdr color schemes" aria-busy={busy}>
      {catalog.map(p => <button key={p.id} type="button" className="herdr-palette-card" aria-pressed={selected === p.id} disabled={busy} onClick={() => void select(p.id)}>
        <span className="herdr-palette-name">{p.name}{selected === p.id && <span>✓</span>}</span>
        {(["dark", "light"] as const).map(mode => <span key={mode} className="herdr-palette-strip"><span className="herdr-palette-mode">{mode === "dark" ? "Dark" : "Light"}</span><span className="herdr-palette-swatches" aria-hidden="true">{p.swatches[mode].map((color,i) => <span key={i} style={{backgroundColor:color}} />)}</span></span>)}
        <span className="herdr-palette-note">{p.adaptedLight ? "Light adapted for BB" : p.id === "lavender" ? "Original BB palette" : "Herdr light and dark pair"}</span>
      </button>)}
    </div>
    <p className="text-sm" role="status">{error || (busy ? "Applying palette…" : selected ? "Selection saved in BB." : "Choose a palette to enable Herdr Theme.")}</p>
    <p className="text-xs text-muted-foreground">Unofficial Herdr-inspired themes. Palettes are adapted for BB readability. Framed panes, prompt styling, and the stock-sidebar treatment follow your selected Herdr palette.</p>
  </div>;
}
