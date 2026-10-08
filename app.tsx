import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { BranchDetails } from "./branch-details";
import { FontPreference } from "./font-preference";
import { mountChrome } from "./chrome";
import "./font.css";
import "./chrome.css";
import "./composition.css";
import "./sidebar.css";

import { Navigation } from "./navigation";
import { PalettePicker } from "./palette-picker";
import "./palette-picker.css";

export default definePluginApp((app) => {
  app.slots.experimental_sidebarNavigation({ id: "herdr-commands", title: "Herdr commands", component: Navigation });
  app.contentScripts.register({ id: "herdr-terminal-chrome", mount: mountChrome });
  app.slots.experimental_appOverlay({ id: "herdr-branch-details", component: BranchDetails });
  app.slots.experimental_appOverlay({ id: "herdr-font-preference", component: FontPreference });
  app.slots.settingsSection({ id: "herdr-about", title: "Color schemes", component: PalettePicker });
});
