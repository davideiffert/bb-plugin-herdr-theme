# Herdr Theme

An unofficial Herdr-inspired theme plugin for BB. Eleven color families, flat prompts, and a
bundled monospace font, inspired by Herdr's workspace.

## Features

- Eleven color families with dark and light appearances in BB's native palette picker.
- A Color schemes section in plugin settings with light/dark swatches and saved selection.
- Framed conversations with the native title set into the top border.
- Left-aligned transcript, full-width user-message highlights, and distinct role markers.
- Matching full-width user and assistant columns that wrap with the pane.
- Flat composer with a decorative prompt marker and focus lines.
- Muted unruled project headings, flat selection, and terminal tree connectors for child threads.
- Bottom New thread/Search commands and a Menu for other destinations.
- Compact desktop composer that grows with text; native phone editor sizing.
- Solid conversation title chips and focused pane borders.
- Solid accent-colored active tabs and thin focused split-pane outlines.
- JetBrains Mono bundled locally. No font service or network requests.
- Coordinated code highlighting for each family.

The plugin keeps BB's native editor, attachments, voice controls, menus,
shortcuts, and send button. It does not read drafts or change agent behavior.
Extra styling only applies while a Herdr Theme palette is selected. Selecting
another theme or disabling Herdr Theme removes that styling.

## Setup

Requires BB 0.43 or newer. Install from Git after the v0.5.0 release is published:

```sh
bb plugin install git:https://github.com/davideiffert/bb-plugin-herdr-theme@v0.5.0
```

This is a release candidate. The public repository and tag are not published yet.

After installing, choose a palette in Settings → Herdr Theme → Color schemes.
Light, Dark, and System appearance remain BB settings. Optional **Show branch
names** adds the known branch beneath stock project-thread rows, including
`main`. It defaults to off. Pinned rows and replacement sidebars do not show
these branch annotations.

## Compatibility

BB owns thread navigation, editing, attachments, voice input and split behavior.
This plugin changes their presentation. It does not provide workspace tabs or
save split arrangements. Those belong in a separate plugin.

Composition uses BB's existing DOM hooks, which are not a versioned styling
API. Tested on BB 0.43. Recheck after BB updates. Both known native sidebar
title wrappers are supported. Folders keeps its own thread list. Compact
Navigation and Herdr use the same exclusive navigation slot; only one supplies
navigation at a time.

Switching to another palette removes Herdr's extra styling. Disabling the
plugin unloads its UI code. Mobile web retains native BB sidebar and touch
controls. The iPhone editor has been checked by a user; automated phone checks use
browser emulation. Actual microphone recording is not independently verified.

## Development

```sh
npm ci
npm run check
npm run build
```

The committed font.css is intentional. BB's Git installer builds the plugin
directly without running npm lifecycle scripts. Regenerate it with the build
command after changing the bundled WOFF2. This candidate is not an npm release.

## Help and contributions

Use GitHub Issues for bugs and small feature proposals. Include BB version,
palette, device, and steps to reproduce. Contributions arrive through pull
requests; see [CONTRIBUTING.md](CONTRIBUTING.md). See [CHANGELOG.md](CHANGELOG.md)
for release notes.

## Credits

Independent community work inspired by [Herdr](https://herdr.dev/) and
[Catppuccin](https://github.com/catppuccin/catppuccin). Not affiliated with
either project. Original palette design by Fable 5.1, integrated and checked
by Codex with David Eiffert.

[JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) is bundled under
the [SIL Open Font License](assets/OFL.txt). `Herdr Mono` is its local CSS
family alias, not a modified font. The regular variable face includes weights
100 through 800. Italics use the browser's synthesis.

Ten families adapt the palettes in Herdr's source. Dracula, Nord, and Vesper
have original BB light companions, labeled in the picker. Lavender is our
original palette. See [palette provenance](palettes/README.md) for the source
revision, adaptations, and bundled Apache 2.0 license.

Plugin code is MIT licensed.
