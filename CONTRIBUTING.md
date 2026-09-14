# Contributing

Bug reports and focused pull requests are welcome. For larger changes, open
an issue first so we can agree on the behavior before implementation.

## Run locally

Use Node 22 and BB 0.43 or newer.

```sh
npm ci
npm run check
npm run build
```

Test the affected controls in BB, including narrow panes and phone widths.
Check theme switching and native thread links after changing CSS. For branch
rows, include a long title, a title with a mention, and a last child. For the
composer, include empty, multiline, collapsed, and expanded states.

When changing palettes, run `npm run palettes`. Generated assets must match
their committed versions. Keep the font and upstream palette licenses intact.

## Scope

This plugin styles BB. Preserve native navigation, editor controls, touch
targets and accessibility. Extra thread details stay optional. Workspace tabs
and saved split arrangements belong in a separate plugin.

Pull requests run type, generation and build checks. A maintainer also reviews
interaction changes. Passing automated checks does not replace using the UI.
