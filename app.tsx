import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { BranchDetails } from "./branch-details";
import { mountChrome } from "./chrome";
import "./font.css";
import "./chrome.css";
import "./composition.css";
import "./sidebar.css";

import { Navigation } from "./navigation";
import { PalettePicker } from "./palette-picker";
import "./palette-picker.css";

export default definePluginApp((app) => {
  app.slots.experimental_sidebarNavigation({ id: "commands", title: "Herdr commands", component: Navigation });
  app.contentScripts.register({ id: "terminal-chrome", mount: mountChrome });
  app.slots.experimental_appOverlay({ id: "branch-details", component: BranchDetails });
  app.slots.settingsSection({ id: "about", title: "Color schemes", component: PalettePicker });
});
