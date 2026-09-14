# Release candidate checks

Candidate version 0.5.0. Runtime source includes development commit 13efd16; README
and internal-document selection were adjusted for a public package. No Git
history is included. The public repository is available. No release tag exists yet.

Passed on BB 0.43:
- Clean dependency install, typecheck, plugin builds and bundled font identity.
- All theme file paths, 11 palette families and 180 generated contrast checks.
- Actual managed Git installation on an isolated BB instance via loopback HTTP.
- Settings persistence through disable/enable, UI cleanup, removal and reinstall.
- Thread navigation, tree connectors, native action-menu keyboard access.
- Rich title layout, compact empty hints and expanded placeholder wrapping.
- Draft attachment display and removal without sending.

Limits:
- Public Git URL, version tag and update-range resolution are not tested.
- User exercised the iPhone editor; actual microphone recording remains unverified.
- npm packaging is unsupported by this candidate; it omits prebuilt dist files.
- BB retains its downloaded Git cache after removing the plugin registration.
- DOM hooks are not versioned; newer BB releases require compatibility checks.
- Real palette-picker screenshots were captured in a clean test instance.
- A conversation screenshot from a sample workspace is still desirable.
