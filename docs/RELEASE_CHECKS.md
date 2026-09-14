# Release checks

Version 0.5.0. Final tag and compatible-version installation results are recorded
in the [GitHub release notes](https://github.com/davideiffert/bb-plugin-herdr-theme/releases/tag/v0.5.0).

Passed on BB 0.43:
- Clean dependency install, typecheck, plugin builds and bundled font identity.
- All theme file paths, 11 palette families and 180 generated contrast checks.
- Managed Git installation from the public GitHub URL in a fresh BB instance.
- BB downloaded and built the source, then loaded all eleven palettes.
- Settings persistence through disable/enable, UI cleanup, removal and reinstall.
- Thread navigation, tree connectors, native action-menu keyboard access.
- Rich title layout, compact empty hints and expanded placeholder wrapping.
- Draft attachment display and removal without sending.

Limits:
- User exercised the iPhone editor; actual microphone recording remains unverified.
- npm packaging is unsupported by this candidate; it omits prebuilt dist files.
- BB retains its downloaded Git cache after removing the plugin registration.
- DOM hooks are not versioned; newer BB releases require compatibility checks.
- Real palette-picker screenshots were captured in a clean test instance.
- Real single-thread dark/light and six-pane screenshots captured with scripted demo data.
- Demo controls use a saved model catalog; screenshots do not represent live agent runs.
