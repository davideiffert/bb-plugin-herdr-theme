import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { contract } from "./contract";
export default function herdrTheme(bb: BbPluginApi) {
  bb.settings.define({
    showBranches: { type: "boolean", label: "Show branch names", default: false,
      description: "Show BB's known Git branch beneath stock sidebar threads. Non-repository threads stay single-line." },
    monoUI: { type: "boolean", label: "Monospace interface", default: true,
      description: "Use Herdr Mono for interface text. Turn off for the system sans-serif font. Code stays monospace." },
  });
  bb.rpc.register(contract, {
    select: async id => (await bb.sdk.theme.set(id)).themeId,
  });
}
