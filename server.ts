import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { contract } from "./contract";
export default function herdrTheme(bb: BbPluginApi) {
  bb.settings.define({
    showBranches: { type: "boolean", label: "Show branch names", default: false,
      description: "Show BB's known Git branch beneath stock sidebar threads. Non-repository threads stay single-line." },
  });
  bb.rpc.register(contract, {
    select: async id => (await bb.sdk.theme.set(id)).themeId,
  });
}
